import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileText, Mic, MicOff, Search, Upload, Video, VideoOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MeetingNotesList } from "@/components/meetings/meeting-notes-list";
import { MeetingRecorder } from "@/components/meetings/meeting-recorder";
import { MeetingNoteDetail } from "@/components/meetings/meeting-note-detail";

export default function MeetingNotesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("notes");
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  
  // Fetch meeting notes
  const { data: meetingNotesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["/api/meeting-notes"],
    queryFn: async () => {
      return apiRequest("GET", "/api/meeting-notes") 
        .then(res => res.json());
    }
  });
  
  // Fetch selected meeting note details
  const { data: selectedNoteData, isLoading: isLoadingSelectedNote } = useQuery({
    queryKey: ["/api/meeting-notes", selectedNoteId],
    queryFn: async () => {
      if (!selectedNoteId) return null;
      return apiRequest("GET", `/api/meeting-notes/${selectedNoteId}`) 
        .then(res => res.json());
    },
    enabled: !!selectedNoteId
  });
  
  // Mutation for deleting a meeting note
  const deleteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      return apiRequest("DELETE", `/api/meeting-notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meeting-notes"] });
      setSelectedNoteId(null);
      toast({
        title: "Meeting note deleted",
        description: "The meeting note has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting meeting note",
        description: error.message || "An error occurred while deleting the meeting note.",
        variant: "destructive",
      });
    }
  });
  
  const handleNoteSelect = (noteId: number) => {
    setSelectedNoteId(noteId);
    setActiveTab("detail");
  };
  
  const handleBackToList = () => {
    setSelectedNoteId(null);
    setActiveTab("notes");
  };
  
  const handleDeleteNote = (noteId: number) => {
    if (confirm("Are you sure you want to delete this meeting note? This action cannot be undone.")) {
      deleteMutation.mutate(noteId);
    }
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Meeting Notes & Analysis</h1>
        <Button 
          onClick={() => setActiveTab("record")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Mic className="mr-2 h-4 w-4" />
          Record New Meeting
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            My Notes
          </TabsTrigger>
          <TabsTrigger value="record">
            <Video className="mr-2 h-4 w-4" />
            Record Meeting
          </TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedNoteId}>
            <Search className="mr-2 h-4 w-4" />
            Note Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes Library</CardTitle>
              <CardDescription>
                Access and manage your meeting notes with AI-powered insights and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MeetingNotesList 
                isLoading={isLoadingNotes}
                meetingNotes={meetingNotesData?.meetingNotes || []}
                onSelectNote={handleNoteSelect}
                onDeleteNote={handleDeleteNote}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="record">
          <MeetingRecorder 
            onRecordingComplete={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/meeting-notes"] });
              setActiveTab("notes");
              toast({
                title: "Meeting recorded",
                description: "Your meeting has been recorded and analyzed successfully.",
                variant: "default",
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="detail">
          {selectedNoteId && (
            <MeetingNoteDetail
              isLoading={isLoadingSelectedNote}
              meetingNote={selectedNoteData?.meetingNote}
              onBackToList={handleBackToList}
              onDeleteNote={() => selectedNoteId && handleDeleteNote(selectedNoteId)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
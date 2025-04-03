import { useState } from "react";
import { format } from "date-fns";
import { Edit3, FileText, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface MeetingNotesListProps {
  isLoading: boolean;
  meetingNotes: any[];
  onSelectNote: (noteId: number) => void;
  onDeleteNote: (noteId: number) => void;
}

export function MeetingNotesList({ 
  isLoading, 
  meetingNotes = [], 
  onSelectNote,
  onDeleteNote
}: MeetingNotesListProps) {
  const [filter, setFilter] = useState("");
  
  const filteredNotes = meetingNotes.filter(note => 
    note.companyName.toLowerCase().includes(filter.toLowerCase()) ||
    note.summary?.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
              <Skeleton className="h-5 w-48" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (meetingNotes.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/80" />
        <h3 className="mt-4 text-lg font-semibold">No meeting notes yet</h3>
        <p className="text-muted-foreground mt-2">
          Start recording your first meeting to create notes with AI analysis
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder="Filter by company name or content..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-lg font-semibold">No matching notes found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filter criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{note.companyName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(note.meetingDate), "PPP")} • {note.meetingType}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelectNote(note.id)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteNote(note.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 line-clamp-3">
                  {note.summary || "No summary available"}
                </div>
              </CardContent>
              <CardFooter 
                className="bg-muted/50 p-4 cursor-pointer" 
                onClick={() => onSelectNote(note.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">
                    {note.aiAnalysis ? "AI Analysis Available" : "No AI Analysis"}
                  </span>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
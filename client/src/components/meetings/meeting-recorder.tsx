import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Camera, Check, Clock, Delete, Info, Loader2, Mic, MicOff, PauseCircle, PlayCircle, Send, Video, VideoOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema for meeting metadata
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  meetingType: z.string({
    required_error: "Please select a meeting type.",
  }),
  participants: z.string().optional(),
});

interface MeetingRecorderProps {
  onRecordingComplete: () => void;
}

export function MeetingRecorder({ onRecordingComplete }: MeetingRecorderProps) {
  const { toast } = useToast();
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("record");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Form for meeting metadata
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      meetingType: "pitch",
      participants: "",
    },
  });
  
  // Mutation to analyze recording and create meeting note
  const analyzeMutation = useMutation({
    mutationFn: async (data: any) => {
      // First analyze the recording
      const analysisResponse = await apiRequest("POST", "/api/meeting-notes/analyze-recording", data);
      const analysisResult = await analysisResponse.json();
      
      // Then create a meeting note with the analysis results
      const noteData = {
        companyName: data.companyName,
        meetingType: data.meetingType,
        participants: data.participants ? data.participants.split(',').map((p: string) => p.trim()) : [],
        summary: analysisResult.analysis.summary,
        transcription: analysisResult.analysis.transcription,
        aiAnalysis: analysisResult.analysis.aiAnalysis,
        facialAnalysisResults: analysisResult.analysis.facialAnalysisResults,
      };
      
      const createResponse = await apiRequest("POST", "/api/meeting-notes", noteData);
      return createResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis complete",
        description: "Meeting recording has been analyzed and notes created.",
        variant: "default",
      });
      setActiveTab("record");
      setRecordingData(null);
      form.reset();
      setRecordingTime(0);
      onRecordingComplete();
    },
    onError: (error: Error) => {
      toast({
        title: "Error analyzing recording",
        description: error.message || "An error occurred during analysis.",
        variant: "destructive",
      });
    },
  });
  
  // Simulate starting audio recording
  const startAudioRecording = () => {
    // In a real implementation, we would use the MediaRecorder API to record audio
    setIsAudioRecording(true);
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    toast({
      title: "Audio recording started",
      description: "The meeting audio is now being recorded.",
      variant: "default",
    });
  };
  
  // Simulate starting video recording
  const startVideoRecording = () => {
    // In a real implementation, we would use the MediaRecorder API to record video
    setIsVideoRecording(true);
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    toast({
      title: "Video recording started",
      description: "The meeting video is now being recorded.",
      variant: "default",
    });
  };
  
  // Simulate stopping recording
  const stopRecording = () => {
    setIsAudioRecording(false);
    setIsVideoRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Simulate recording data (in a real implementation, this would be the actual recorded data)
    setRecordingData({
      duration: recordingTime,
      // In a real implementation, these would be actual audio/video data
      hasAudio: isAudioRecording,
      hasVideo: isVideoRecording,
      timestamp: new Date().toISOString(),
    });
    
    setActiveTab("review");
    
    toast({
      title: "Recording stopped",
      description: "The meeting recording has been stopped.",
      variant: "default",
    });
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle form submission for analysis
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!recordingData) {
      toast({
        title: "No recording data",
        description: "Please record a meeting first.",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare data for analysis
    const analysisData = {
      ...data,
      // These would be actual base64 encoded audio/video data in a real implementation
      base64Audio: isAudioRecording ? "simulated-audio-data" : null,
      base64Video: isVideoRecording ? "simulated-video-data" : null,
    };
    
    analyzeMutation.mutate(analysisData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Recorder</CardTitle>
        <CardDescription>
          Record and analyze meetings with AI-powered transcription and insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Record Meeting</TabsTrigger>
            <TabsTrigger value="review" disabled={!recordingData}>Review & Analyze</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recording Controls</h3>
                <p className="text-sm text-muted-foreground">
                  Record audio and/or video of your meeting for AI analysis.
                </p>
              </div>
              
              <div className="flex justify-center items-center gap-4 p-6 border rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={isAudioRecording ? "destructive" : "outline"}
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={isAudioRecording ? stopRecording : startAudioRecording}
                    disabled={!isAudioRecording && isVideoRecording}
                  >
                    {isAudioRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <span className="text-sm font-medium">
                    {isAudioRecording ? "Stop" : "Audio"}
                  </span>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={isVideoRecording ? "destructive" : "outline"}
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={isVideoRecording ? stopRecording : startVideoRecording}
                    disabled={!isVideoRecording && isAudioRecording}
                  >
                    {isVideoRecording ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                  </Button>
                  <span className="text-sm font-medium">
                    {isVideoRecording ? "Stop" : "Video"}
                  </span>
                </div>
              </div>
              
              {(isAudioRecording || isVideoRecording) && (
                <div className="flex justify-center items-center gap-2 text-lg font-bold">
                  <Clock className="h-5 w-5 text-red-500 animate-pulse" />
                  <span className="text-red-500">{formatTime(recordingTime)}</span>
                </div>
              )}
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Simulated Feature</AlertTitle>
                <AlertDescription>
                  In this demo, recording is simulated. In a production environment, this would use the 
                  MediaRecorder API to capture actual audio/video with user permission.
                </AlertDescription>
              </Alert>
              
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="meetingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select meeting type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pitch">Pitch</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="due-diligence">Due Diligence</SelectItem>
                            <SelectItem value="team-intro">Team Introduction</SelectItem>
                            <SelectItem value="technical-review">Technical Review</SelectItem>
                            <SelectItem value="board-meeting">Board Meeting</SelectItem>
                            <SelectItem value="investor-update">Investor Update</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Participants (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter participants' names and roles, separated by commas" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Example: John Smith (CEO), Jane Doe (CFO)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            {recordingData && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Review Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your recording before analysis.
                  </p>
                </div>
                
                <div className="p-6 border rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">Recording Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(recordingData.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{formatTime(recordingData.duration)}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {recordingData.hasAudio && (
                          <Badge variant="outline" className="text-xs">
                            <Mic className="h-3 w-3 mr-1" />
                            Audio
                          </Badge>
                        )}
                        {recordingData.hasVideo && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="meetingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select meeting type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pitch">Pitch</SelectItem>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="due-diligence">Due Diligence</SelectItem>
                                <SelectItem value="team-intro">Team Introduction</SelectItem>
                                <SelectItem value="technical-review">Technical Review</SelectItem>
                                <SelectItem value="board-meeting">Board Meeting</SelectItem>
                                <SelectItem value="investor-update">Investor Update</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Participants (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter participants' names and roles, separated by commas" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Example: John Smith (CEO), Jane Doe (CFO)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Alert variant="default" className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-600">Analysis Information</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          Upon analysis, the meeting will be transcribed and AI will analyze content, sentiment, 
                          and facial expressions to provide insights.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={() => {
                            setRecordingData(null);
                            setActiveTab("record");
                          }}
                        >
                          <Delete className="h-4 w-4 mr-1" />
                          Discard
                        </Button>
                        
                        <Button 
                          type="submit"
                          disabled={analyzeMutation.isPending || !form.formState.isValid}
                        >
                          {analyzeMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Analyze Recording
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          Recordings are processed securely with advanced AI analysis
        </div>
      </CardFooter>
    </Card>
  );
}
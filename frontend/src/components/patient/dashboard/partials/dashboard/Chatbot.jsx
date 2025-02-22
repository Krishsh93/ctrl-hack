"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileUp, Stethoscope, Bot, Loader2, Mic, MicOff } from "lucide-react";

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Sending Messages (PDF or Text)
  const handleSendMessage = async () => {
    if (!input.trim() && !pdfFile) return;

    const userMessage = { text: input || "PDF uploaded", sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();

      // If a PDF file exists, send it to `/upload`
      if (pdfFile) {
        formData.append("question", input || ""); 
        formData.append("pdf", pdfFile);

        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
        }
      } 
      // Otherwise, send text to `/chat`
      else {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input }),
        });

        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error processing request. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
      setPdfFile(null); 
    }
  };

  // Handle PDF Upload
  const handleUploadPDF = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setMessages((prev) => [
        ...prev,
        { text: `Medical records uploaded: ${file.name}`, sender: "system", type: "notification" },
      ]);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Handle Audio Recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await handleSendVoice(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record voice messages.");
    }
  };

  // Stop Recording and Send Automatically
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Send Voice to `/voice` API
  const handleSendVoice = async (audioBlob) => {
    const formData = new FormData();
    formData.append("voice", audioBlob, "recorded_audio.wav");

    try {
      setMessages((prev) => [
        ...prev,
        { text: "Voice message sent...", sender: "system", type: "notification" },
      ]);

      const response = await fetch("http://localhost:8000/voice", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error sending voice:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error processing voice message.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-teal-50 to-blue-50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Stethoscope className="w-6 h-6 text-teal-600" />
          <h1 className="text-xl font-semibold text-gray-800">Medical Assistant</h1>
        </div>
        <p className="text-sm text-gray-600">Your secure healthcare companion.</p>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="h-[40vh] overflow-y-auto p-4 bg-gray-50 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 mr-2 rounded-full bg-teal-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
              )}
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === "user" ? "bg-teal-600 text-white" : msg.sender === "system" ? "bg-blue-50 text-blue-800 text-sm" : "bg-white text-gray-800 border border-gray-100"}`}>
                <p>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing request...</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-gradient-to-r from-teal-50 to-blue-50 p-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
          <input type="text" placeholder="Type your question..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border" disabled={loading} />
          <input type="file" accept="application/pdf" onChange={handleUploadPDF} className="hidden" id="pdf-upload" />
          <label htmlFor="pdf-upload" className="p-2 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer"><FileUp className="w-5 h-5" /></label>
          <button onClick={recording ? handleStopRecording : handleStartRecording} className="p-2 bg-white rounded-lg border">{recording ? <MicOff className="w-5 h-5 text-red-600" /> : <Mic className="w-5 h-5" />}</button>
          <button type="submit" disabled={loading || (!input.trim() && !pdfFile)} className="p-2 bg-teal-600 text-white rounded-lg"><Send className="w-5 h-5" /></button>
        </form>
      </div>
    </div>
  );
}

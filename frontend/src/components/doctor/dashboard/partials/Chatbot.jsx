"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, FileUp, Stethoscope, Bot, Loader2 } from "lucide-react"

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const chatContainerRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() && !pdfFile) return

    const userMessage = { text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      let response
      if (pdfFile) {
        const formData = new FormData()
        formData.append("message", input)
        formData.append("file", pdfFile)

        response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })
      } else {
        response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        })
      }

      const data = await response.json()
      console.log("API Response:", data) // Debugging API response

      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }])
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Unexpected response format. Please try again.", sender: "bot" },
        ])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { text: "Error processing request. Please try again.", sender: "bot" },
      ])
    } finally {
      setLoading(false)
      setPdfFile(null) // Reset the file after sending
    }
  }

  const handleUploadPDF = (event) => {
    const file = event.target.files[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      setMessages((prev) => [
        ...prev,
        { text: `Medical records uploaded: ${file.name}`, sender: "system", type: "notification" },
      ])
    } else {
      alert("Please upload a valid PDF file containing your medical records.")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-teal-50 to-blue-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-6 h-6 text-teal-600" />
          <h1 className="text-xl font-semibold text-gray-800">Medical Assistant</h1>
        </div>
        <p className="text-sm text-gray-600">
          Your secure healthcare companion. Ask questions about symptoms, medications, or schedule appointments.
        </p>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="h-[40vh] overflow-y-auto p-4 bg-gray-50 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 mr-2 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-teal-600" />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white"
                    : msg.sender === "system"
                      ? "bg-blue-50 text-blue-800 text-sm"
                      : "bg-white text-gray-800 border border-gray-100"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing your request...</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-gradient-to-r from-teal-50 to-blue-50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your health-related question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && !pdfFile)}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              type="button"
              className="p-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              aria-label="Upload medical records"
            >
              <FileUp className="w-5 h-5" />
            </button>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleUploadPDF}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload medical records"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

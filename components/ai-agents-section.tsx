"use client"

import { useState } from "react"
import { Send, MessageSquare, Search, Code, Sparkles, Brain, Bot, type LucideIcon } from "lucide-react"

type Agent = {
  id: string
  name: string
  description: string
  Icon: LucideIcon
  bgColor: string
}

const agents: Agent[] = [
  {
    id: "general",
    name: "General AI",
    description: "General purpose assistant",
    Icon: Bot,
    bgColor: "bg-blue-500",
  },
  {
    id: "research",
    name: "Research",
    description: "Deep research & analysis",
    Icon: Search,
    bgColor: "bg-teal-500",
  },
  {
    id: "code",
    name: "Code Expert",
    description: "Programming assistance",
    Icon: Code,
    bgColor: "bg-violet-500",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Creative writing & ideas",
    Icon: Sparkles,
    bgColor: "bg-orange-500",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Complex problem solving",
    Icon: Brain,
    bgColor: "bg-pink-500",
  },
]

export function AIAgentsSection() {
  const [activeAgent, setActiveAgent] = useState("general")
  const [message, setMessage] = useState("")

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-[320px_1fr]">
          {/* Left Panel - Agent Selection */}
          <div className="p-6 border-r border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">AI Agents</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Specialized agents for different tasks
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {agents.map((agent) => {
                const isActive = activeAgent === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div
                      className={`size-10 rounded-lg flex items-center justify-center ${agent.bgColor} text-white`}
                    >
                      <agent.Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900">
                          {agent.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-neutral-900 text-white"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isActive ? "active" : "idle"}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate">
                        {agent.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex flex-col min-h-[500px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <MessageSquare className="size-5 text-neutral-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    AI Chat Assistant
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Powered by specialized AI agents
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex flex-col gap-4">
                {/* AI Message */}
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-neutral-500" />
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                    <p className="text-neutral-900">
                      Hello! I&apos;m your AI assistant with specialized agents.
                      How can I help you today?
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 ml-11">18:01</p>

                {/* Typing Indicator */}
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Bot className="size-4 text-white" />
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="size-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="size-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="size-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors">
                  <Send className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

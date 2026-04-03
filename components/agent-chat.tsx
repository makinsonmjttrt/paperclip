"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Bot,
  User,
  Loader2,
  CircuitBoard,
  Target,
  Sparkles,
  Terminal,
  Eye,
  FileCode,
  Heart,
  Search,
  Globe,
  Crown,
  type LucideIcon,
} from "lucide-react"

// ---- Types -----------------------------------------------------------------

interface Agent {
  readonly id: string
  readonly name: string
  readonly title: string
  readonly icon: string
  readonly status: "idle" | "running" | "paused" | "error"
  readonly color: string
}

interface ChatMessage {
  readonly id: string
  readonly role: "user" | "agent"
  readonly content: string
  readonly agentId?: string
  readonly agentName?: string
  readonly timestamp: Date
  readonly issueId?: string
  readonly status?: "sending" | "processing" | "done" | "error"
}

// ---- Icon map --------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  "circuit-board": CircuitBoard,
  target: Target,
  sparkles: Sparkles,
  terminal: Terminal,
  eye: Eye,
  "file-code": FileCode,
  heart: Heart,
  search: Search,
  globe: Globe,
  crown: Crown,
  bot: Bot,
}

const AGENT_COLORS: Record<string, string> = {
  ceo: "from-amber-500 to-orange-600",
  cto: "from-cyan-500 to-blue-600",
  cmo: "from-pink-500 to-rose-600",
  "product-owner": "from-violet-500 to-purple-600",
  engineer: "from-emerald-500 to-green-600",
  "code-reviewer": "from-indigo-500 to-blue-600",
  "technical-writer": "from-teal-500 to-cyan-600",
  "customer-success": "from-red-400 to-pink-500",
  "ux-researcher": "from-yellow-500 to-amber-600",
  "linkedin-growth-director": "from-blue-500 to-indigo-600",
  "chat-assistant": "from-gray-500 to-zinc-600",
}

function getAgentIcon(iconName: string | null): LucideIcon {
  if (!iconName) return Bot
  return ICON_MAP[iconName] ?? Bot
}

function getAgentColor(urlKey: string): string {
  return AGENT_COLORS[urlKey] ?? "from-gray-500 to-zinc-600"
}

// ---- Component -------------------------------------------------------------

export function AgentChat() {
  const [agents, setAgents] = useState<readonly Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState<readonly ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      content:
        "Welcome to FourPointZero Command. Select an agent or type a message and I'll route it to the right team member.",
      agentName: "System",
      timestamp: new Date(),
      status: "done",
    },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fetch agents from Paperclip
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch("/api/agents")
        if (!res.ok) throw new Error("Failed to fetch agents")

        const data = await res.json()

        const mapped: Agent[] = data
          .filter(
            (a: { name: string }) =>
              a.name !== "Chat Assistant"
          )
          .map(
            (a: {
              id: string
              name: string
              title: string | null
              icon: string | null
              status: string
              urlKey: string
            }) => ({
              id: a.id,
              name: a.name,
              title: a.title ?? a.name,
              icon: a.icon ?? "bot",
              status: a.status,
              color: getAgentColor(a.urlKey),
            })
          )

        // Sort: CEO first, then alphabetical
        mapped.sort((a, b) => {
          if (a.name === "CEO") return -1
          if (b.name === "CEO") return 1
          return a.name.localeCompare(b.name)
        })

        setAgents(mapped)
      } catch {
        // Fallback to hardcoded agents if Paperclip unreachable
        setAgents([
          {
            id: "ceo",
            name: "CEO",
            title: "CEO",
            icon: "crown",
            status: "idle",
            color: "from-amber-500 to-orange-600",
          },
          {
            id: "cto",
            name: "CTO",
            title: "Chief Technology Officer",
            icon: "circuit-board",
            status: "idle",
            color: "from-cyan-500 to-blue-600",
          },
          {
            id: "cmo",
            name: "CMO",
            title: "Chief Marketing Officer",
            icon: "sparkles",
            status: "idle",
            color: "from-pink-500 to-rose-600",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isSending) return

    const messageText = input.trim()
    setInput("")
    setIsSending(true)

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])

    // Determine target agent
    const targetAgentId = selectedAgent ?? agents[0]?.id
    const targetAgent = agents.find((a) => a.id === targetAgentId)

    if (!targetAgentId) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "agent",
          content: "No agents available. Is Paperclip running?",
          agentName: "System",
          timestamp: new Date(),
          status: "error",
        },
      ])
      setIsSending(false)
      return
    }

    // Add processing indicator
    const processingId = `proc-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: processingId,
        role: "agent",
        content: "",
        agentId: targetAgentId,
        agentName: targetAgent?.name ?? "Agent",
        timestamp: new Date(),
        status: "processing",
      },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          agentId: targetAgentId,
        }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const issue = await res.json()

      // Replace processing message with confirmation
      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId
            ? {
                ...m,
                content: `Task assigned: ${issue.identifier}. ${targetAgent?.name ?? "Agent"} is working on it.`,
                status: "done",
                issueId: issue.id,
              }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === processingId
            ? {
                ...m,
                content:
                  "Failed to reach Paperclip. Check the tunnel connection.",
                status: "error",
              }
            : m
        )
      )
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }, [input, isSending, selectedAgent, agents])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectedAgentData = agents.find((a) => a.id === selectedAgent)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050509]">
      {/* Agent Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex w-72 flex-col border-r border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl"
      >
        {/* Logo area */}
        <div className="p-5 border-b border-white/[0.06]">
          <h1 className="text-lg font-semibold text-white tracking-tight">
            FourPointZero
          </h1>
          <p className="text-xs text-[#616675] mt-0.5">Agent Command Centre</p>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 text-[#616675] animate-spin" />
            </div>
          ) : (
            <>
              {/* Auto-route option */}
              <button
                onClick={() => setSelectedAgent(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group ${
                  selectedAgent === null
                    ? "bg-white/[0.08] ring-1 ring-white/[0.12]"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <div className="size-9 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                  <Bot className="size-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-[#EFF1F6] block">
                    Auto-route
                  </span>
                  <span className="text-xs text-[#616675]">
                    Smart agent selection
                  </span>
                </div>
              </button>

              <div className="h-px bg-white/[0.06] my-2" />

              {agents.map((agent) => {
                const Icon = getAgentIcon(agent.icon)
                const isActive = selectedAgent === agent.id
                return (
                  <motion.button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group cursor-pointer ${
                      isActive
                        ? "bg-white/[0.08] ring-1 ring-white/[0.12]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`size-9 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#EFF1F6] truncate">
                          {agent.name}
                        </span>
                        <span
                          className={`size-1.5 rounded-full ${
                            agent.status === "running"
                              ? "bg-emerald-400 animate-pulse"
                              : agent.status === "idle"
                                ? "bg-[#616675]"
                                : "bg-amber-400"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-[#616675] truncate block">
                        {agent.title}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </>
          )}
        </div>

        {/* Connection status */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[#616675]">Paperclip connected</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-[#0a0a12]/60 backdrop-blur-xl"
        >
          {selectedAgentData ? (
            <>
              <div
                className={`size-10 rounded-lg bg-gradient-to-br ${selectedAgentData.color} flex items-center justify-center`}
              >
                {(() => {
                  const Icon = getAgentIcon(selectedAgentData.icon)
                  return <Icon className="size-5 text-white" />
                })()}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#EFF1F6]">
                  {selectedAgentData.name}
                </h2>
                <p className="text-xs text-[#9A9EAD]">
                  {selectedAgentData.title}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Bot className="size-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#EFF1F6]">
                  FPZ Command
                </h2>
                <p className="text-xs text-[#9A9EAD]">
                  Auto-routing to best agent
                </p>
              </div>
            </>
          )}
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-[#1EA3C7]/20"
                      : "bg-white/[0.06]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="size-4 text-[#1EA3C7]" />
                  ) : (
                    <Bot className="size-4 text-[#9A9EAD]" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-[#1EA3C7]/10 border border-[#1EA3C7]/20 rounded-2xl rounded-tr-sm"
                      : "bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm"
                  } px-4 py-3`}
                >
                  {msg.agentName && msg.role === "agent" && (
                    <p className="text-xs font-medium text-[#9A9EAD] mb-1">
                      {msg.agentName}
                    </p>
                  )}
                  {msg.status === "processing" ? (
                    <div className="flex gap-1.5 py-1">
                      <motion.span
                        className="size-2 bg-[#1EA3C7] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.span
                        className="size-2 bg-[#3C66EA] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.span
                        className="size-2 bg-[#B844BC] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  ) : (
                    <p
                      className={`text-sm leading-relaxed ${
                        msg.status === "error"
                          ? "text-red-400"
                          : "text-[#EFF1F6]"
                      }`}
                    >
                      {msg.content}
                    </p>
                  )}
                  {msg.issueId && (
                    <p className="text-xs text-[#616675] mt-1.5">
                      Tracking: {msg.issueId.slice(0, 8)}...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-[#0a0a12]/60 backdrop-blur-xl">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedAgentData
                    ? `Message ${selectedAgentData.name}...`
                    : "Type a message..."
                }
                disabled={isSending}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#EFF1F6] placeholder:text-[#616675] focus:outline-none focus:ring-1 focus:ring-[#1EA3C7]/50 focus:border-[#1EA3C7]/30 transition-all duration-200 disabled:opacity-50"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="size-12 rounded-xl bg-gradient-to-r from-[#1EA3C7] to-[#3C66EA] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-200 cursor-pointer"
            >
              {isSending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Send className="size-5" />
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  )
}

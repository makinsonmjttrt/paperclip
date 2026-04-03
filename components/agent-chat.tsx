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
  MessageCircle,
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

// ---- Empty state -----------------------------------------------------------

function EmptyState({ agentName }: { agentName?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        className="size-16 rounded-2xl bg-gradient-to-br from-[#1EA3C7]/20 to-[#B844BC]/20 border border-white/[0.06] flex items-center justify-center mb-5"
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageCircle className="size-7 text-[#1EA3C7]" />
      </motion.div>
      <h3 className="text-base font-semibold text-[#EFF1F6] mb-1.5">
        {agentName ? `Chat with ${agentName}` : "FPZ Agent Command"}
      </h3>
      <p className="text-sm text-[#616675] max-w-xs leading-relaxed">
        {agentName
          ? `Send a task or question directly to ${agentName}.`
          : "Type a message below. Select an agent from the sidebar, or let auto-routing pick the best one."}
      </p>

      {/* Quick action hints */}
      <div className="flex gap-2 mt-6">
        {["Draft a LinkedIn post", "Review the roadmap", "Run a code audit"].map(
          (hint, i) => (
            <motion.span
              key={hint}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#9A9EAD] cursor-default"
            >
              {hint}
            </motion.span>
          )
        )}
      </div>
    </motion.div>
  )
}

// ---- Main component --------------------------------------------------------

export function AgentChat() {
  const [agents, setAgents] = useState<readonly Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState<readonly ChatMessage[]>([])
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
          .filter((a: { name: string }) => a.name !== "Chat Assistant")
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
        setAgents([
          { id: "ceo", name: "CEO", title: "CEO", icon: "crown", status: "idle", color: "from-amber-500 to-orange-600" },
          { id: "cto", name: "CTO", title: "Chief Technology Officer", icon: "circuit-board", status: "idle", color: "from-cyan-500 to-blue-600" },
          { id: "cmo", name: "CMO", title: "Chief Marketing Officer", icon: "sparkles", status: "idle", color: "from-pink-500 to-rose-600" },
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

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])

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
                content: "Failed to reach Paperclip. Check the tunnel connection.",
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
  const hasMessages = messages.length > 0

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent relative z-10">
      {/* ── Agent Sidebar ── */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex w-72 flex-col border-r border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl"
      >
        <div className="p-5 border-b border-white/[0.06]">
          <h1 className="text-lg font-semibold text-white tracking-tight font-[family-name:var(--font-heading)]">
            FourPointZero
          </h1>
          <p className="text-xs text-[#616675] mt-0.5">Agent Command Centre</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 text-[#616675] animate-spin" />
            </div>
          ) : (
            <>
              {/* Auto-route */}
              <button
                onClick={() => setSelectedAgent(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                  selectedAgent === null
                    ? "bg-white/[0.08] ring-1 ring-white/[0.12]"
                    : "hover:bg-white/[0.04]"
                }`}
              >
                <div className="size-9 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/10">
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

              {/* Agent buttons */}
              {agents.map((agent, i) => {
                const Icon = getAgentIcon(agent.icon)
                const isActive = selectedAgent === agent.id
                return (
                  <motion.button
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    onClick={() => setSelectedAgent(agent.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
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
                          className={`size-1.5 rounded-full shrink-0 ${
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

      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-[#0a0a12]/60 backdrop-blur-xl"
        >
          {selectedAgentData ? (
            <>
              <div
                className={`size-10 rounded-lg bg-gradient-to-br ${selectedAgentData.color} flex items-center justify-center shadow-lg`}
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
              <span
                className={`ml-auto text-xs px-2.5 py-1 rounded-full border ${
                  selectedAgentData.status === "running"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/[0.08] bg-white/[0.04] text-[#616675]"
                }`}
              >
                {selectedAgentData.status}
              </span>
            </>
          ) : (
            <>
              <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/10">
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

        {/* Messages or Empty State */}
        {hasMessages ? (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const msgAgent = msg.agentId
                  ? agents.find((a) => a.id === msg.agentId)
                  : undefined

                return (
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
                          : msgAgent
                            ? `bg-gradient-to-br ${msgAgent.color}`
                            : "bg-white/[0.06]"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="size-4 text-[#1EA3C7]" />
                      ) : msgAgent ? (
                        (() => {
                          const Icon = getAgentIcon(msgAgent.icon)
                          return <Icon className="size-3.5 text-white" />
                        })()
                      ) : (
                        <Bot className="size-4 text-[#9A9EAD]" />
                      )}
                    </div>

                    {/* Bubble */}
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
                          {[0, 0.2, 0.4].map((delay) => (
                            <motion.span
                              key={delay}
                              className="size-2 rounded-full"
                              style={{
                                background:
                                  delay === 0
                                    ? "#1EA3C7"
                                    : delay === 0.2
                                      ? "#3C66EA"
                                      : "#B844BC",
                              }}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay,
                              }}
                            />
                          ))}
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
                        <p className="text-xs text-[#616675] mt-1.5 font-mono">
                          {msg.issueId.slice(0, 8)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <EmptyState agentName={selectedAgentData?.name} />
        )}

        {/* ── Input ── */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-[#0a0a12]/60 backdrop-blur-xl">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
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
              {/* Gradient glow on focus */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#1EA3C7]/0 via-[#3C66EA]/0 to-[#B844BC]/0 group-focus-within:from-[#1EA3C7]/10 group-focus-within:via-[#3C66EA]/10 group-focus-within:to-[#B844BC]/10 transition-all duration-300 -z-10 blur-sm" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="size-12 rounded-xl bg-gradient-to-r from-[#1EA3C7] to-[#3C66EA] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-200 cursor-pointer shadow-lg shadow-[#1EA3C7]/20"
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

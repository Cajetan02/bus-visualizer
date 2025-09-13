import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ControlSignalsProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
}

interface Signal {
  name: string;
  description: string;
  active: boolean;
  category: "bus" | "memory" | "register" | "alu" | "control";
}

const SIGNAL_DEFINITIONS: Record<string, Omit<Signal, "active">> = {
  // Memory Control
  "MEM_READ": { name: "MEM_READ", description: "Memory Read Enable", category: "memory" },
  "MEM_WRITE": { name: "MEM_WRITE", description: "Memory Write Enable", category: "memory" },
  "IO_READ": { name: "IO_READ", description: "I/O Read Enable", category: "memory" },
  "IO_WRITE": { name: "IO_WRITE", description: "I/O Write Enable", category: "memory" },
  
  // Bus Control
  "BUS_REQ": { name: "BUS_REQ", description: "Bus Request", category: "bus" },
  "BUS_GRANT": { name: "BUS_GRANT", description: "Bus Grant", category: "bus" },
  "ALE": { name: "ALE", description: "Address Latch Enable", category: "bus" },
  
  // Register Control
  "REG_WRITE": { name: "REG_WRITE", description: "Register Write Enable", category: "register" },
  "REG_READ": { name: "REG_READ", description: "Register Read Enable", category: "register" },
  "PC_INC": { name: "PC_INC", description: "Program Counter Increment", category: "register" },
  "SP_DEC": { name: "SP_DEC", description: "Stack Pointer Decrement", category: "register" },
  
  // ALU Control
  "ALU_ADD": { name: "ALU_ADD", description: "ALU Addition", category: "alu" },
  "ALU_SUB": { name: "ALU_SUB", description: "ALU Subtraction", category: "alu" },
  "ALU_AND": { name: "ALU_AND", description: "ALU Logical AND", category: "alu" },
  "ALU_OR": { name: "ALU_OR", description: "ALU Logical OR", category: "alu" },
  
  // Control Unit
  "DECODE": { name: "DECODE", description: "Instruction Decode", category: "control" },
  "EXEC": { name: "EXEC", description: "Execute Control", category: "control" },
  "HALT": { name: "HALT", description: "Halt Processor", category: "control" },
};

export const ControlSignals = ({ currentPhase, isExecuting }: ControlSignalsProps) => {
  const [activeSignals, setActiveSignals] = useState<Set<string>>(new Set());

  useEffect(() => {
    let signals: string[] = [];
    
    switch (currentPhase) {
      case "fetch":
        signals = ["MEM_READ", "BUS_REQ", "ALE", "PC_INC", "REG_READ"];
        break;
      case "decode":
        signals = ["DECODE", "REG_READ"];
        break;
      case "execute":
        signals = ["EXEC", "ALU_ADD", "REG_READ"];
        break;
      case "writeback":
        signals = ["REG_WRITE", "MEM_WRITE"];
        break;
      default:
        signals = [];
    }
    
    setActiveSignals(new Set(signals));
  }, [currentPhase]);

  const getSignalsByCategory = (category: Signal["category"]) => {
    return Object.values(SIGNAL_DEFINITIONS)
      .filter(signal => signal.category === category)
      .map(signal => ({
        ...signal,
        active: activeSignals.has(signal.name)
      }));
  };

  const SignalIndicator = ({ signal }: { signal: Signal }) => (
    <div className={cn(
      "p-2 rounded-md border transition-all duration-300 font-mono",
      signal.active 
        ? "border-signal-active bg-signal-active/20 animate-signal-flow" 
        : "border-signal-inactive bg-signal-inactive/10"
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          "text-xs font-bold",
          signal.active ? "text-signal-active" : "text-signal-inactive"
        )}>
          {signal.name}
        </span>
        <div className={cn(
          "w-3 h-3 rounded-full transition-all duration-300",
          signal.active 
            ? "bg-signal-active animate-terminal-blink" 
            : "bg-signal-inactive"
        )} />
      </div>
      <div className="text-xs text-muted-foreground">
        {signal.description}
      </div>
    </div>
  );

  const categories: { name: Signal["category"]; label: string; color: string }[] = [
    { name: "memory", label: "Memory", color: "cpu-memory" },
    { name: "bus", label: "Bus", color: "cpu-bus" },
    { name: "register", label: "Register", color: "cpu-register" },
    { name: "alu", label: "ALU", color: "cpu-alu" },
    { name: "control", label: "Control", color: "cpu-control" },
  ];

  return (
    <div className="space-y-4">
      {/* Phase Status */}
      <div className="text-center p-3 border border-border rounded-lg bg-card/30">
        <div className="text-sm font-mono font-bold text-foreground mb-1">
          Current Phase: 
          <span className={cn(
            "ml-2",
            currentPhase === "fetch" ? "text-phase-fetch" :
            currentPhase === "decode" ? "text-phase-decode" :
            currentPhase === "execute" ? "text-phase-execute" :
            currentPhase === "writeback" ? "text-phase-writeback" :
            "text-muted-foreground"
          )}>
            {currentPhase.toUpperCase()}
          </span>
        </div>
        <div className={cn(
          "text-xs",
          isExecuting ? "text-signal-active animate-terminal-blink" : "text-muted-foreground"
        )}>
          {isExecuting ? "EXECUTING" : "IDLE"}
        </div>
      </div>

      {/* Signal Categories */}
      {categories.map(category => {
        const signals = getSignalsByCategory(category.name);
        const activeCount = signals.filter(s => s.active).length;
        
        return (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className={cn(
                "text-sm font-bold font-mono",
                `text-${category.color}`
              )}>
                {category.label} Control
              </h4>
              <span className="text-xs font-mono text-muted-foreground">
                {activeCount}/{signals.length} active
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {signals.map(signal => (
                <SignalIndicator key={signal.name} signal={signal} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Signal Legend */}
      <div className="p-3 border border-border rounded-lg bg-muted/10">
        <h4 className="text-xs font-bold text-muted-foreground font-mono mb-2">Signal States</h4>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-signal-active animate-terminal-blink" />
            <span className="text-signal-active">ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-signal-inactive" />
            <span className="text-signal-inactive">INACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
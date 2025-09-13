import { cn } from "@/lib/utils";

interface CPUArchitectureProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  selectedInstruction: string;
}

export const CPUArchitecture = ({ currentPhase, isExecuting, selectedInstruction }: CPUArchitectureProps) => {
  return (
    <div className="relative bg-gradient-to-br from-card to-muted/20 p-8 rounded-lg border border-border">
      {/* CPU Bus System */}
      <div className="grid grid-cols-3 gap-8 items-center">
        {/* Left Side - Memory Interface */}
        <div className="space-y-4">
          <div className={cn(
            "p-4 rounded-lg border-2 transition-all duration-500",
            currentPhase === "fetch" ? "border-phase-fetch bg-phase-fetch/10 animate-control-pulse" : "border-border",
            "bg-cpu-memory/5"
          )}>
            <h3 className="font-mono text-sm font-bold text-cpu-memory">Memory Interface</h3>
            <div className="mt-2 space-y-1 text-xs font-mono text-muted-foreground">
              <div>Address Bus (20-bit)</div>
              <div>Data Bus (16-bit)</div>
              <div>Control Bus</div>
            </div>
          </div>

          {/* Address & Data Buses */}
          <div className="relative">
            <div className={cn(
              "h-2 bg-cpu-bus/30 rounded-full relative overflow-hidden",
              isExecuting && "animate-signal-flow"
            )}>
              <div className={cn(
                "h-full bg-cpu-bus transition-all duration-1000",
                currentPhase === "fetch" ? "w-full animate-data-transfer" : "w-0"
              )} />
            </div>
            <span className="text-xs font-mono text-cpu-bus ml-2">Data Bus</span>
          </div>
        </div>

        {/* Center - CPU Core */}
        <div className="relative">
          <div className={cn(
            "p-6 rounded-lg border-4 transition-all duration-500 bg-gradient-to-br from-card to-background",
            isExecuting ? "border-primary animate-control-pulse" : "border-border"
          )}>
            <h3 className="font-mono text-lg font-bold text-primary text-center mb-4">8086 CPU Core</h3>
            
            {/* ALU */}
            <div className={cn(
              "p-3 mb-3 rounded border-2 transition-all duration-500",
              currentPhase === "execute" ? "border-cpu-alu bg-cpu-alu/10 animate-register-update" : "border-border",
              "bg-cpu-alu/5"
            )}>
              <div className="text-sm font-mono font-bold text-cpu-alu">ALU</div>
              <div className="text-xs text-muted-foreground">Arithmetic Logic Unit</div>
            </div>

            {/* Control Unit */}
            <div className={cn(
              "p-3 mb-3 rounded border-2 transition-all duration-500",
              currentPhase === "decode" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-sm font-mono font-bold text-cpu-control">Control Unit</div>
              <div className="text-xs text-muted-foreground">Instruction Decoder</div>
            </div>

            {/* Bus Interface Unit */}
            <div className={cn(
              "p-3 rounded border-2 transition-all duration-500",
              currentPhase === "fetch" ? "border-cpu-bus bg-cpu-bus/10 animate-signal-flow" : "border-border",
              "bg-cpu-bus/5"
            )}>
              <div className="text-sm font-mono font-bold text-cpu-bus">BIU</div>
              <div className="text-xs text-muted-foreground">Bus Interface Unit</div>
            </div>
          </div>

          {/* Current Instruction Display */}
          {selectedInstruction && (
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary rounded">
              <div className="text-xs font-mono text-secondary">Current Instruction:</div>
              <div className="font-mono font-bold text-primary">{selectedInstruction}</div>
            </div>
          )}
        </div>

        {/* Right Side - Registers */}
        <div className="space-y-4">
          <div className={cn(
            "p-4 rounded-lg border-2 transition-all duration-500",
            currentPhase === "writeback" ? "border-cpu-register bg-cpu-register/10 animate-register-update" : "border-border",
            "bg-cpu-register/5"
          )}>
            <h3 className="font-mono text-sm font-bold text-cpu-register">Register File</h3>
            <div className="mt-2 space-y-1 text-xs font-mono text-muted-foreground">
              <div>General Purpose (AX-DX)</div>
              <div>Index (SI, DI)</div>
              <div>Pointer (SP, BP)</div>
              <div>Segment (CS, DS, ES, SS)</div>
            </div>
          </div>

          {/* Internal Bus */}
          <div className="relative">
            <div className={cn(
              "h-2 bg-primary/30 rounded-full relative overflow-hidden",
              isExecuting && "animate-signal-flow"
            )}>
              <div className={cn(
                "h-full bg-primary transition-all duration-1000",
                currentPhase === "writeback" ? "w-full animate-data-transfer" : "w-0"
              )} />
            </div>
            <span className="text-xs font-mono text-primary ml-2">Internal Bus</span>
          </div>
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-full">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            isExecuting ? "animate-terminal-blink" : "",
            currentPhase === "idle" ? "bg-muted-foreground" :
            currentPhase === "fetch" ? "bg-phase-fetch" :
            currentPhase === "decode" ? "bg-phase-decode" :
            currentPhase === "execute" ? "bg-phase-execute" :
            "bg-phase-writeback"
          )} />
          <span className="font-mono text-sm font-bold">
            {currentPhase.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
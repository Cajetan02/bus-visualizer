import { cn } from "@/lib/utils";

interface CPUArchitectureProps {
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  selectedInstruction: string;
}

export const CPUArchitecture = ({ currentPhase, isExecuting, selectedInstruction }: CPUArchitectureProps) => {
  return (
    <div className="relative bg-gradient-to-br from-card to-muted/20 p-4 lg:p-8 rounded-lg border border-border overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-mono text-lg lg:text-xl font-bold text-primary">8086 Single Bus Organization</h2>
          <div className="text-xs text-muted-foreground mt-1">All components connected via system bus</div>
        </div>

        {/* Top Components Row */}
        <div className="flex justify-between items-start mb-8">
          {/* CPU Components */}
          <div className="flex flex-col items-center space-y-4">
            {/* Control Unit */}
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "decode" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">CONTROL</div>
              <div className="text-xs font-mono font-bold text-cpu-control">UNIT</div>
              <div className="text-[10px] text-muted-foreground">CU</div>
            </div>

            {/* Vertical Connection to Bus */}
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "decode" ? "bg-cpu-control animate-signal-flow" : "bg-border"
            )} />
          </div>

          {/* ALU */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "execute" ? "border-cpu-alu bg-cpu-alu/10 animate-register-update" : "border-border",
              "bg-cpu-alu/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-alu">ALU</div>
              <div className="text-[10px] text-muted-foreground">Arithmetic</div>
              <div className="text-[10px] text-muted-foreground">Logic Unit</div>
            </div>

            {/* Vertical Connection to Bus */}
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "execute" ? "bg-cpu-alu animate-signal-flow" : "bg-border"
            )} />
          </div>

          {/* Registers */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "writeback" ? "border-cpu-register bg-cpu-register/10 animate-register-update" : "border-border",
              "bg-cpu-register/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-register">REGISTERS</div>
              <div className="text-[10px] text-muted-foreground">AX BX CX DX</div>
              <div className="text-[10px] text-muted-foreground">SI DI BP SP</div>
            </div>

            {/* Vertical Connection to Bus */}
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "writeback" ? "bg-cpu-register animate-signal-flow" : "bg-border"
            )} />
          </div>

          {/* Memory */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "fetch" ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MEMORY</div>
              <div className="text-[10px] text-muted-foreground">1MB</div>
              <div className="text-[10px] text-muted-foreground">RAM/ROM</div>
            </div>

            {/* Vertical Connection to Bus */}
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "fetch" ? "bg-cpu-memory animate-signal-flow" : "bg-border"
            )} />
          </div>

          {/* I/O Ports */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              "border-border bg-muted/5"
            )}>
              <div className="text-xs font-mono font-bold text-muted-foreground">I/O PORTS</div>
              <div className="text-[10px] text-muted-foreground">0000-FFFF</div>
              <div className="text-[10px] text-muted-foreground">Peripherals</div>
            </div>

            {/* Vertical Connection to Bus */}
            <div className="w-1 h-8 bg-border" />
          </div>
        </div>

        {/* Central System Bus */}
        <div className="relative mb-8">
          {/* Main Bus Line */}
          <div className={cn(
            "h-4 bg-gradient-to-r from-cpu-bus/20 via-cpu-bus/40 to-cpu-bus/20 rounded-full relative overflow-hidden border-2 border-cpu-bus/50"
          )}>
            {/* Animated Data Flow */}
            <div className={cn(
              "h-full bg-gradient-to-r from-transparent via-cpu-bus to-transparent transition-all duration-1000",
              isExecuting ? "animate-data-transfer" : "w-0"
            )} />
          </div>

          {/* Bus Labels */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="text-xs font-mono font-bold text-cpu-bus">SYSTEM BUS</div>
          </div>
          
          {/* Bus Specifications */}
          <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
            <span>20-bit Address Bus</span>
            <span>16-bit Data Bus</span>
            <span>Control Signals</span>
          </div>
        </div>

        {/* Bottom Components Row */}
        <div className="flex justify-between items-start">
          {/* Program Counter */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "fetch" ? "bg-cpu-control animate-signal-flow" : "bg-border"
            )} />
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "fetch" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">PC</div>
              <div className="text-[10px] text-muted-foreground">Program</div>
              <div className="text-[10px] text-muted-foreground">Counter</div>
            </div>
          </div>

          {/* Instruction Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              currentPhase === "decode" ? "bg-cpu-control animate-signal-flow" : "bg-border"
            )} />
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              currentPhase === "decode" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">IR</div>
              <div className="text-[10px] text-muted-foreground">Instruction</div>
              <div className="text-[10px] text-muted-foreground">Register</div>
            </div>
          </div>

          {/* Memory Address Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              (currentPhase === "fetch" || currentPhase === "execute") ? "bg-cpu-memory animate-signal-flow" : "bg-border"
            )} />
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              (currentPhase === "fetch" || currentPhase === "execute") ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MAR</div>
              <div className="text-[10px] text-muted-foreground">Memory</div>
              <div className="text-[10px] text-muted-foreground">Address</div>
            </div>
          </div>

          {/* Memory Data Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              (currentPhase === "fetch" || currentPhase === "writeback") ? "bg-cpu-memory animate-signal-flow" : "bg-border"
            )} />
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              (currentPhase === "fetch" || currentPhase === "writeback") ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MDR</div>
              <div className="text-[10px] text-muted-foreground">Memory</div>
              <div className="text-[10px] text-muted-foreground">Data</div>
            </div>
          </div>

          {/* Bus Interface Unit */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-1 h-8 transition-all duration-500",
              isExecuting ? "bg-cpu-bus animate-signal-flow" : "bg-border"
            )} />
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center",
              isExecuting ? "border-cpu-bus bg-cpu-bus/10 animate-signal-flow" : "border-border",
              "bg-cpu-bus/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-bus">BIU</div>
              <div className="text-[10px] text-muted-foreground">Bus Interface</div>
              <div className="text-[10px] text-muted-foreground">Unit</div>
            </div>
          </div>
        </div>

        {/* Current Instruction & Phase Display */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          {selectedInstruction && (
            <div className="p-3 bg-secondary/10 border border-secondary rounded-lg">
              <div className="text-xs font-mono text-secondary">Current Instruction:</div>
              <div className="font-mono font-bold text-primary text-lg">{selectedInstruction}</div>
            </div>
          )}
          
          {/* Phase Indicator */}
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
              {currentPhase.toUpperCase()} PHASE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { cn } from "@/lib/utils";

type ExecutionPhase = "idle" | "step1" | "step2" | "step3" | "step4" | "step5";

interface CPUArchitectureProps {
  currentPhase: ExecutionPhase;
  isExecuting: boolean;
}

export const CPUArchitecture = ({ currentPhase, isExecuting }: CPUArchitectureProps) => {
  // Helper function to determine if a component should glow
  const shouldGlow = (component: string): string => {
    if (!isExecuting) return '';
    
    switch (currentPhase) {
      case 'step1': // PC → MAR, PC+4 → ALU
        return component === 'mar' || component === 'alu' 
          ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-400/50' : '';
      
      case 'step2': // Z → PC (ALU and MAR still active)
        return component === 'alu' || component === 'mar'
          ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/50' : '';
      
      case 'step3': // MDR → IR (only MDR, Memory, IR)
        return component === 'mdr' || component === 'ir' || component === 'memory'
          ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50' : '';
      
      case 'step4': // AX → Y, BX → ALU (ALU, Registers, control bus)
        return component === 'registers' || component === 'alu' || component === 'bus'
          ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-400/50' : '';
      
      case 'step5': // ALU result → flags (control bus, ALU, Registers)
        return component === 'alu' || component === 'registers' || component === 'bus'
          ? 'ring-2 ring-red-400 shadow-lg shadow-red-400/50' : '';
      
      default:
        return '';
    }
  };

  // Helper function for bus glow
  const getBusGlow = (): string => {
    if (!isExecuting) return 'stroke-gray-600';
    
    switch (currentPhase) {
      case 'step2': // Value on bus from ALU to PC
      case 'step4': // Register value on bus
      case 'step5': // ALU result on bus
        return 'stroke-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]';
      default:
        return 'stroke-gray-600';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-card to-muted/20 p-3 rounded-lg border border-border">
      <div className="w-full max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="font-mono text-sm lg:text-base font-bold text-primary">8086 Single Bus Organization</h2>
          <div className="text-xs text-muted-foreground">CMP AX,BX Instruction Execution</div>
        </div>

        {/* Compact Layout */}
        <div className="space-y-3">
          {/* Top Row: ALU and Registers */}
          <div className="flex justify-center items-center space-x-8">
            {/* ALU */}
            <div className={cn(
              "w-20 h-12 p-1 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              shouldGlow('alu'),
              "bg-cpu-alu/10 border-cpu-alu"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-alu">ALU</div>
              
              {/* Activity indicator */}
              {isExecuting && (currentPhase === "step1" || currentPhase === "step4" || currentPhase === "step5") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cpu-alu rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Registers */}
            <div className={cn(
              "w-20 h-12 p-1 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              shouldGlow('registers'),
              "bg-cpu-register/10 border-cpu-register"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-register">REGISTERS</div>
              
              {/* Activity indicator */}
              {isExecuting && (currentPhase === "step4" || currentPhase === "step5") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cpu-register rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Central System Bus with connections */}
          <div className="relative mx-auto max-w-lg">
            {/* Connection lines from MAR and MDR to bus */}
            <svg className="absolute inset-0 w-full h-16 pointer-events-none">
              {/* MAR to Bus line */}
              <line 
                x1="25%" y1="100%" 
                x2="25%" y2="50%" 
                stroke="hsl(var(--cpu-memory))" 
                strokeWidth="2" 
                className={cn(
                  "transition-all duration-300",
                  isExecuting && (currentPhase === "step1" || currentPhase === "step2") ? "opacity-100" : "opacity-30"
                )}
              />
              {/* MDR to Bus line */}
              <line 
                x1="75%" y1="100%" 
                x2="75%" y2="50%" 
                stroke="hsl(var(--cpu-memory))" 
                strokeWidth="2" 
                className={cn(
                  "transition-all duration-300",
                  isExecuting && currentPhase === "step3" ? "opacity-100" : "opacity-30"
                )}
              />
              
            </svg>

            {/* Main Bus Line */}
            <div className={cn(
              "h-3 bg-gradient-to-r from-cpu-bus/20 via-cpu-bus/40 to-cpu-bus/20 rounded-full relative overflow-hidden border border-cpu-bus/50 mt-8",
              shouldGlow('bus'),
              isExecuting && "animate-bus-glow"
            )}>
              {/* Animated Data Streams when bus glows */}
              {isExecuting && (currentPhase === "step2" || currentPhase === "step4" || currentPhase === "step5") && (
                <>
                  {/* Primary Data Stream */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="h-full bg-gradient-to-r from-transparent via-cpu-bus to-transparent animate-bit-stream-1 rounded-full" />
                  </div>
                  
                  {/* Data Packets */}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                    <div className="flex space-x-4 animate-data-packet">
                      <div className="w-4 h-1 bg-cpu-bus rounded-sm animate-data-pulse relative">
                        <div className="absolute inset-0 bg-white/20 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bus Label */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="text-xs font-mono font-bold text-cpu-bus flex items-center">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1 transition-all duration-300",
                  isExecuting ? "bg-cpu-bus animate-terminal-blink" : "bg-cpu-bus/50"
                )} />
                SYSTEM BUS
              </div>
            </div>
          </div>

          {/* Bottom Row: PC, IR, MAR, MDR */}
          <div className="flex justify-center items-center space-x-6">
            {/* Program Counter */}
            <div className={cn(
              "w-16 h-12 p-1 rounded-lg transition-all duration-500 flex flex-col items-center justify-center relative",
              "border border-border bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">PC</div>
              
              {/* Activity indicator */}
              {isExecuting && (currentPhase === "step1" || currentPhase === "step2") && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cpu-control rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Instruction Register */}
            <div className={cn(
              "w-16 h-12 p-1 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              shouldGlow('ir'),
              "bg-cpu-control/10 border-cpu-control"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">IR</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "step3" && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cpu-control rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Memory Address Register */}
            <div className={cn(
              "w-16 h-12 p-1 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              shouldGlow('mar'),
              "bg-cpu-memory/10 border-cpu-memory"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MAR</div>
              
              {/* Activity indicator */}
              {isExecuting && (currentPhase === "step1" || currentPhase === "step2") && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cpu-memory rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Memory Data Register */}
            <div className={cn(
              "w-16 h-12 p-1 rounded-lg transition-all duration-500 flex flex-col items-center justify-center relative",
              shouldGlow('mdr'),
              "bg-cpu-memory/10 border border-border"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MDR</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "step3" && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cpu-memory rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex justify-center mt-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isExecuting ? "animate-terminal-blink" : "",
                currentPhase === "idle" ? "bg-muted-foreground" :
                currentPhase === "step1" ? "bg-cpu-control" :
                currentPhase === "step2" ? "bg-cpu-control" :
                currentPhase === "step3" ? "bg-cpu-control" :
                currentPhase === "step4" ? "bg-cpu-register" :
                "bg-cpu-alu"
              )} />
              <span className="font-mono text-xs font-bold">
                {currentPhase.toUpperCase()} PHASE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import { cn } from "@/lib/utils";

type ExecutionPhase = "idle" | "iac" | "if" | "iod" | "oac" | "of" | "do";

interface CPUArchitectureProps {
  currentPhase: ExecutionPhase;
  isExecuting: boolean;
}

export const CPUArchitecture = ({ currentPhase, isExecuting }: CPUArchitectureProps) => {
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
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              currentPhase === "iod" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">CONTROL</div>
              <div className="text-xs font-mono font-bold text-cpu-control">UNIT</div>
              <div className="text-[10px] text-muted-foreground">CU</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "iod" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cpu-control rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Vertical Connection to Bus */}
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500 relative",
                currentPhase === "iod" ? "bg-cpu-control" : "bg-border"
              )}>
                {/* Data flowing down */}
                {isExecuting && currentPhase === "iod" && (
                  <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-control rounded-full animate-data-pulse"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-control/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-control/40 rounded-full animate-data-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ALU */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              currentPhase === "do" ? "border-cpu-alu bg-cpu-alu/10 animate-register-update" : "border-border",
              "bg-cpu-alu/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-alu">ALU</div>
              <div className="text-[10px] text-muted-foreground">Arithmetic</div>
              <div className="text-[10px] text-muted-foreground">Logic Unit</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "do" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cpu-alu rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Vertical Connection to Bus */}
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                currentPhase === "do" ? "bg-cpu-alu" : "bg-border"
              )}>
                {/* Data flowing */}
                {isExecuting && currentPhase === "do" && (
                  <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-alu rounded-full animate-data-pulse"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-alu/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-alu/40 rounded-full animate-data-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Registers */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              (currentPhase === "of" || currentPhase === "do") ? "border-cpu-register bg-cpu-register/10 animate-register-update" : "border-border",
              "bg-cpu-register/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-register">REGISTERS</div>
              <div className="text-[10px] text-muted-foreground">AX BX CX DX</div>
              <div className="text-[10px] text-muted-foreground">SI DI BP SP</div>
              
              {/* Activity indicator */}
              {isExecuting && (currentPhase === "of" || currentPhase === "do") && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cpu-register rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Vertical Connection to Bus */}
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                (currentPhase === "of" || currentPhase === "do") ? "bg-cpu-register" : "bg-border"
              )}>
                {/* Data flowing */}
                {isExecuting && (currentPhase === "of" || currentPhase === "do") && (
                  <>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-register rounded-full animate-data-pulse"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-register/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Memory */}
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-28 h-20 p-3 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              currentPhase === "if" ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MEMORY</div>
              <div className="text-[10px] text-muted-foreground">1MB</div>
              <div className="text-[10px] text-muted-foreground">RAM/ROM</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "if" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cpu-memory rounded-full animate-data-pulse"></div>
              )}
            </div>

            {/* Vertical Connection to Bus */}
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                currentPhase === "if" ? "bg-cpu-memory" : "bg-border"
              )}>
                {/* Data flowing both ways during fetch */}
                {isExecuting && currentPhase === "if" && (
                  <>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-memory rounded-full animate-data-pulse"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-memory/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </>
                )}
              </div>
            </div>
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
            "h-6 bg-gradient-to-r from-cpu-bus/20 via-cpu-bus/40 to-cpu-bus/20 rounded-full relative overflow-hidden border-2 border-cpu-bus/50",
            isExecuting && "animate-bus-glow"
          )}>
            {/* Animated Data Streams */}
            {isExecuting && (
              <>
                {/* Primary Data Stream */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="h-full bg-gradient-to-r from-transparent via-cpu-bus to-transparent animate-bit-stream-1 rounded-full" />
                </div>
                
                {/* Secondary Data Stream */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="h-full bg-gradient-to-r from-transparent via-cpu-memory/80 to-transparent animate-bit-stream-2 rounded-full" />
                </div>
                
                {/* Tertiary Data Stream */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="h-full bg-gradient-to-r from-transparent via-cpu-register/60 to-transparent animate-bit-stream-3 rounded-full" />
                </div>
                
                {/* Data Packets */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                  <div className="flex space-x-4 animate-data-packet">
                    {/* Packet 1 */}
                    <div className="w-8 h-3 bg-cpu-bus rounded-sm animate-data-pulse relative">
                      <div className="absolute inset-0 bg-white/20 rounded-sm"></div>
                    </div>
                    {/* Packet 2 */}
                    <div className="w-6 h-2 bg-cpu-memory/80 rounded-sm animate-data-pulse" style={{ animationDelay: '0.2s' }}>
                      <div className="absolute inset-0 bg-white/20 rounded-sm"></div>
                    </div>
                    {/* Packet 3 */}
                    <div className="w-4 h-2 bg-cpu-register/60 rounded-sm animate-data-pulse" style={{ animationDelay: '0.4s' }}>
                      <div className="absolute inset-0 bg-white/20 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Binary Bits Visualization */}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start overflow-hidden">
                  <div className="flex space-x-1 animate-data-bits">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 h-1 rounded-full",
                          Math.random() > 0.5 ? "bg-cpu-bus" : "bg-cpu-bus/40",
                          "animate-data-pulse"
                        )}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bus Labels */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="text-xs font-mono font-bold text-cpu-bus flex items-center">
              <div className={cn(
                "w-2 h-2 rounded-full mr-2 transition-all duration-300",
                isExecuting ? "bg-cpu-bus animate-terminal-blink" : "bg-cpu-bus/50"
              )} />
              SYSTEM BUS
            </div>
          </div>
          
          
          {/* Data Flow Direction Indicators */}
          {isExecuting && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-2">
              <div className="text-cpu-bus text-xs animate-data-pulse">▶</div>
              <div className="text-cpu-bus text-xs animate-data-pulse" style={{ animationDelay: '0.3s' }}>▶</div>
              <div className="text-cpu-bus text-xs animate-data-pulse" style={{ animationDelay: '0.6s' }}>▶</div>
              <div className="text-cpu-bus text-xs animate-data-pulse" style={{ animationDelay: '0.9s' }}>▶</div>
            </div>
          )}
        </div>

        {/* Bottom Components Row */}
        <div className="flex justify-between items-start">
          {/* Program Counter */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                currentPhase === "iac" ? "bg-cpu-control" : "bg-border"
              )}>
                {/* Data flowing up to bus */}
                {isExecuting && currentPhase === "iac" && (
                  <>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-control rounded-full animate-data-pulse"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-control/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              currentPhase === "iac" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">PC</div>
              <div className="text-[10px] text-muted-foreground">Program</div>
              <div className="text-[10px] text-muted-foreground">Counter</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "iac" && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cpu-control rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Instruction Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                currentPhase === "iod" ? "bg-cpu-control" : "bg-border"
              )}>
                {/* Data flowing down from bus */}
                {isExecuting && currentPhase === "iod" && (
                  <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-control rounded-full animate-data-pulse"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-control/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              currentPhase === "iod" ? "border-cpu-control bg-cpu-control/10 animate-control-pulse" : "border-border",
              "bg-cpu-control/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-control">IR</div>
              <div className="text-[10px] text-muted-foreground">Instruction</div>
              <div className="text-[10px] text-muted-foreground">Register</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "iod" && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cpu-control rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Memory Address Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                (currentPhase === "if") ? "bg-cpu-memory" : "bg-border"
              )}>
                {/* Bidirectional data flow */}
                {isExecuting && currentPhase === "if" && (
                  <>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-memory rounded-full animate-data-pulse"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-memory/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              (currentPhase === "if") ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MAR</div>
              <div className="text-[10px] text-muted-foreground">Memory</div>
              <div className="text-[10px] text-muted-foreground">Address</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "if" && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cpu-memory rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Memory Data Register */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                (currentPhase === "if") ? "bg-cpu-memory" : "bg-border"
              )}>
                {/* Data flowing both directions */}
                {isExecuting && currentPhase === "if" && (
                  <>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-memory rounded-full animate-data-pulse"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-memory/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              (currentPhase === "if") ? "border-cpu-memory bg-cpu-memory/10 animate-control-pulse" : "border-border",
              "bg-cpu-memory/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-memory">MDR</div>
              <div className="text-[10px] text-muted-foreground">Memory</div>
              <div className="text-[10px] text-muted-foreground">Data</div>
              
              {/* Activity indicator */}
              {isExecuting && currentPhase === "if" && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cpu-memory rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>

          {/* Bus Interface Unit */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={cn(
                "w-1 h-8 transition-all duration-500",
                isExecuting ? "bg-cpu-bus" : "bg-border"
              )}>
                {/* Continuous data flow when executing */}
                {isExecuting && (
                  <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cpu-bus rounded-full animate-data-pulse"></div>
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-bus/60 rounded-full animate-data-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cpu-bus/40 rounded-full animate-data-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-28 h-16 p-2 rounded-lg border-2 transition-all duration-500 flex flex-col items-center justify-center relative",
              isExecuting ? "border-cpu-bus bg-cpu-bus/10 animate-signal-flow" : "border-border",
              "bg-cpu-bus/5"
            )}>
              <div className="text-xs font-mono font-bold text-cpu-bus">BIU</div>
              <div className="text-[10px] text-muted-foreground">Bus Interface</div>
              <div className="text-[10px] text-muted-foreground">Unit</div>
              
              {/* Activity indicator */}
              {isExecuting && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cpu-bus rounded-full animate-data-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Current Instruction & Phase Display */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Phase Indicator */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-muted rounded-full">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              isExecuting ? "animate-terminal-blink" : "",
              currentPhase === "idle" ? "bg-muted-foreground" :
              currentPhase === "iac" ? "bg-cpu-control" :
              currentPhase === "if" ? "bg-phase-fetch" :
              currentPhase === "iod" ? "bg-cpu-control" :
              currentPhase === "oac" ? "bg-cpu-register" :
              currentPhase === "of" ? "bg-cpu-register" :
              "bg-cpu-alu"
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
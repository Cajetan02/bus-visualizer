import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicroinstructionSequencerProps {
  instruction: string;
  currentPhase: "idle" | "fetch" | "decode" | "execute" | "writeback";
  isExecuting: boolean;
  onExecutionStart: () => void;
  onExecutionStop: () => void;
}

interface Microinstruction {
  id: number;
  name: string;
  phase: "fetch" | "decode" | "execute" | "writeback";
  signals: string[];
  duration: number;
}

const MICROINSTRUCTIONS_MAP: Record<string, Microinstruction[]> = {
  "MOV AX, BX": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Operands", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "Read Source", phase: "execute", signals: ["BX→TempReg"], duration: 600 },
    { id: 4, name: "Write Destination", phase: "writeback", signals: ["TempReg→AX"], duration: 600 },
  ],
  "MOV R1, (R2)": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Addressing", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "Read Address", phase: "execute", signals: ["R2→MAR"], duration: 600 },
    { id: 4, name: "Memory Access", phase: "execute", signals: ["MEM→MDR"], duration: 800 },
    { id: 5, name: "Store Data", phase: "writeback", signals: ["MDR→R1"], duration: 600 },
  ],
  "MOV (R1), R2": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Addressing", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "Setup Address", phase: "execute", signals: ["R1→MAR"], duration: 600 },
    { id: 4, name: "Setup Data", phase: "execute", signals: ["R2→MDR"], duration: 600 },
    { id: 5, name: "Memory Write", phase: "writeback", signals: ["MDR→MEM"], duration: 800 },
  ],
  "ADD R1, (R2)": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Operation", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "Read Memory Address", phase: "execute", signals: ["R2→MAR"], duration: 600 },
    { id: 4, name: "Fetch Operand", phase: "execute", signals: ["MEM→MDR", "MDR→Y"], duration: 800 },
    { id: 5, name: "ALU Addition", phase: "execute", signals: ["R1→ALU_A", "Y→ALU_B", "ALU_ADD"], duration: 1000 },
    { id: 6, name: "Update Flags", phase: "execute", signals: ["ALU_FLAGS→FLAGS"], duration: 400 },
    { id: 7, name: "Store Result", phase: "writeback", signals: ["ALU→R1"], duration: 600 },
  ],
  "ADD AX, 1000H": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Fetch Immediate", phase: "fetch", signals: ["PC+1→MAR", "MEM→MDR"], duration: 1000 },
    { id: 3, name: "Decode Operation", phase: "decode", signals: ["IR→CU", "MDR→Y"], duration: 800 },
    { id: 4, name: "ALU Addition", phase: "execute", signals: ["AX→ALU_A", "Y→ALU_B", "ALU_ADD"], duration: 1200 },
    { id: 5, name: "Update Flags", phase: "execute", signals: ["ALU_FLAGS→FLAGS"], duration: 400 },
    { id: 6, name: "Store Result", phase: "writeback", signals: ["ALU→AX"], duration: 600 },
  ],
  "SUB R1, R2": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Operands", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "Setup ALU", phase: "execute", signals: ["R1→ALU_A", "R2→ALU_B"], duration: 600 },
    { id: 4, name: "ALU Subtraction", phase: "execute", signals: ["ALU_SUB", "ALU→Z"], duration: 1000 },
    { id: 5, name: "Update Flags", phase: "execute", signals: ["ALU_FLAGS→FLAGS"], duration: 400 },
    { id: 6, name: "Store Result", phase: "writeback", signals: ["Z→R1"], duration: 600 },
  ],
  "CMP R1, R2": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Decode Compare", phase: "decode", signals: ["IR→CU", "CU→RegSelect"], duration: 800 },
    { id: 3, name: "ALU Compare", phase: "execute", signals: ["R1→ALU_A", "R2→ALU_B", "ALU_SUB"], duration: 1000 },
    { id: 4, name: "Update Flags Only", phase: "execute", signals: ["ALU_FLAGS→FLAGS"], duration: 600 },
  ],
  "JMP 2000H": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Fetch Address", phase: "fetch", signals: ["PC+1→MAR", "MEM→MDR"], duration: 1000 },
    { id: 3, name: "Decode Jump", phase: "decode", signals: ["IR→CU", "MDR→TEMP"], duration: 800 },
    { id: 4, name: "Update PC", phase: "execute", signals: ["TEMP→PC"], duration: 600 },
  ],
  "JZ 3000H": [
    { id: 1, name: "Fetch Instruction", phase: "fetch", signals: ["PC→MAR", "MEM→MDR", "MDR→IR"], duration: 1000 },
    { id: 2, name: "Fetch Address", phase: "fetch", signals: ["PC+1→MAR", "MEM→MDR"], duration: 1000 },
    { id: 3, name: "Check Zero Flag", phase: "decode", signals: ["IR→CU", "FLAGS→CU"], duration: 800 },
    { id: 4, name: "Conditional Jump", phase: "execute", signals: ["MDR→TEMP", "TEMP→PC"], duration: 600 },
  ]
};

export const MicroinstructionSequencer = ({ 
  instruction, 
  currentPhase, 
  isExecuting, 
  onExecutionStart, 
  onExecutionStop 
}: MicroinstructionSequencerProps) => {
  const [currentMicroinstruction, setCurrentMicroinstruction] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepMode, setStepMode] = useState(false);

  const microinstructions = MICROINSTRUCTIONS_MAP[instruction] || [];

  useEffect(() => {
    if (isExecuting && !stepMode && microinstructions.length > 0) {
      const currentMicro = microinstructions[currentMicroinstruction];
      if (currentMicro) {
        let progressTimer: NodeJS.Timeout;
        const startTime = Date.now();
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / currentMicro.duration) * 100, 100);
          setProgress(newProgress);
          
          if (newProgress < 100) {
            progressTimer = setTimeout(updateProgress, 50);
          } else {
            // Move to next microinstruction
            if (currentMicroinstruction < microinstructions.length - 1) {
              setCurrentMicroinstruction(prev => prev + 1);
              setProgress(0);
            } else {
              // Execution complete
              onExecutionStop();
              setCurrentMicroinstruction(0);
              setProgress(0);
            }
          }
        };
        
        updateProgress();
        
        return () => {
          if (progressTimer) clearTimeout(progressTimer);
        };
      }
    }
  }, [isExecuting, stepMode, currentMicroinstruction, microinstructions, onExecutionStop]);

  const handleStart = () => {
    if (microinstructions.length > 0) {
      setCurrentMicroinstruction(0);
      setProgress(0);
      onExecutionStart();
    }
  };

  const handleStep = () => {
    if (microinstructions.length > 0) {
      if (currentMicroinstruction < microinstructions.length - 1) {
        setCurrentMicroinstruction(prev => prev + 1);
        setProgress(100);
      } else {
        setCurrentMicroinstruction(0);
        setProgress(0);
      }
    }
  };

  const handleStop = () => {
    onExecutionStop();
    setCurrentMicroinstruction(0);
    setProgress(0);
  };

  if (!instruction) {
    return (
      <Card className="p-6 border-dashed border-2 border-border bg-muted/20">
        <div className="text-center text-muted-foreground font-mono">
          <div className="text-lg mb-2">No instruction selected</div>
          <div className="text-sm">Select an instruction from the editor to begin simulation</div>
        </div>
      </Card>
    );
  }

  const currentMicro = microinstructions[currentMicroinstruction];

  return (
    <div className="space-y-4">
      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={handleStart}
          disabled={isExecuting}
          variant="default"
          size="sm"
          className="font-mono"
        >
          <Play className="w-4 h-4 mr-1" />
          Execute
        </Button>
        
        <Button
          onClick={handleStep}
          disabled={isExecuting && !stepMode}
          variant="outline"
          size="sm"
          className="font-mono"
        >
          <SkipForward className="w-4 h-4 mr-1" />
          Step
        </Button>
        
        <Button
          onClick={handleStop}
          disabled={!isExecuting}
          variant="destructive"
          size="sm"
          className="font-mono"
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
      </div>

      {/* Current Microinstruction */}
      {currentMicro && (
        <Card className={cn(
          "p-4 border-2 transition-all duration-300",
          isExecuting ? "border-primary animate-control-pulse" : "border-border",
          "bg-gradient-to-r from-card to-muted/20"
        )}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
            <h4 className="font-mono text-sm font-bold text-primary">
              Step {currentMicroinstruction + 1} of {microinstructions.length}
            </h4>
            <span className={cn(
              "text-xs font-mono px-2 py-1 rounded",
              currentMicro.phase === "fetch" ? "bg-phase-fetch/20 text-phase-fetch" :
              currentMicro.phase === "decode" ? "bg-phase-decode/20 text-phase-decode" :
              currentMicro.phase === "execute" ? "bg-phase-execute/20 text-phase-execute" :
              "bg-phase-writeback/20 text-phase-writeback"
            )}>
              {currentMicro.phase.toUpperCase()}
            </span>
          </div>
          
          <div className="font-mono text-lg font-bold text-foreground mb-2">
            {currentMicro.name}
          </div>
          
          <Progress 
            value={progress} 
            className="mb-3 h-2"
          />
          
          <div className="space-y-1">
            <div className="text-xs font-bold text-muted-foreground font-mono">Control Signals:</div>
            <div className="flex flex-wrap gap-1">
              {currentMicro.signals.map((signal, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "text-xs px-2 py-1 rounded font-mono transition-all duration-300",
                    isExecuting ? "bg-cpu-control/20 text-cpu-control animate-signal-flow" : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Microinstruction Timeline */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-foreground font-mono">Microinstruction Sequence</h4>
        <div className="space-y-1">
          {microinstructions.map((micro, idx) => (
            <div
              key={micro.id}
              className={cn(
                "flex items-center p-2 rounded border transition-all duration-300 font-mono",
                idx === currentMicroinstruction 
                  ? "border-primary bg-primary/10" 
                  : idx < currentMicroinstruction 
                    ? "border-cpu-control bg-cpu-control/5 opacity-60" 
                    : "border-border bg-card/30"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3",
                idx === currentMicroinstruction 
                  ? "bg-primary text-primary-foreground animate-terminal-blink" 
                  : idx < currentMicroinstruction 
                    ? "bg-cpu-control text-white" 
                    : "bg-muted text-muted-foreground"
              )}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{micro.name}</div>
                <div className="text-xs text-muted-foreground">
                  {micro.signals.join(" → ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
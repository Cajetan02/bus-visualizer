import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InstructionEditorProps {
  onInstructionSelect: (instruction: string) => void;
  selectedInstruction: string;
}

const SAMPLE_INSTRUCTIONS = [
  { name: "MOV AX, BX", description: "Move register BX to AX", microops: ["Fetch Instruction", "Decode Operands", "Read Source", "Write Destination"] },
  { name: "MOV R1, (R2)", description: "Move memory contents at R2 to R1", microops: ["Fetch Instruction", "Decode Addressing", "Read Address", "Memory Access", "Store Data"] },
  { name: "MOV (R1), R2", description: "Move R2 to memory location at R1", microops: ["Fetch Instruction", "Decode Addressing", "Setup Address", "Setup Data", "Memory Write"] },
  { name: "ADD R1, (R2)", description: "Add memory contents at R2 to R1", microops: ["Fetch Instruction", "Decode Operation", "Read Memory Address", "Fetch Operand", "ALU Addition", "Update Flags", "Store Result"] },
  { name: "ADD AX, 1000H", description: "Add immediate value to AX", microops: ["Fetch Instruction", "Fetch Immediate", "Decode Operation", "ALU Addition", "Update Flags", "Store Result"] },
  { name: "SUB R1, R2", description: "Subtract R2 from R1", microops: ["Fetch Instruction", "Decode Operands", "Setup ALU", "ALU Subtraction", "Update Flags", "Store Result"] },
  { name: "CMP R1, R2", description: "Compare R1 with R2", microops: ["Fetch Instruction", "Decode Compare", "ALU Compare", "Update Flags Only"] },
  { name: "JMP 2000H", description: "Jump to address 2000H", microops: ["Fetch Instruction", "Fetch Address", "Decode Jump", "Update PC"] },
  { name: "JZ 3000H", description: "Jump if zero flag is set", microops: ["Fetch Instruction", "Fetch Address", "Check Zero Flag", "Conditional Jump"] }
];

export const InstructionEditor = ({ onInstructionSelect, selectedInstruction }: InstructionEditorProps) => {
  const [customInstruction, setCustomInstruction] = useState("");
  const [selectedSample, setSelectedSample] = useState("");

  const handleSampleSelect = (instruction: string) => {
    setSelectedSample(instruction);
    onInstructionSelect(instruction);
  };

  const handleCustomSubmit = () => {
    if (customInstruction.trim()) {
      onInstructionSelect(customInstruction.trim());
      setCustomInstruction("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Select */}
      <div>
        <h4 className="text-sm font-bold text-secondary mb-2 font-mono">Sample Instructions</h4>
        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-1">
          {SAMPLE_INSTRUCTIONS.map((instr, index) => (
            <Button
              key={index}
              variant={selectedInstruction === instr.name ? "secondary" : "outline"}
              className={cn(
                "justify-start h-auto p-2 lg:p-3 font-mono text-xs",
                selectedInstruction === instr.name && "animate-control-pulse"
              )}
              onClick={() => handleSampleSelect(instr.name)}
            >
              <div className="text-left">
                <div className="font-bold text-primary text-xs lg:text-sm">{instr.name}</div>
                <div className="text-muted-foreground text-xs hidden sm:block">{instr.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Instruction */}
      <div>
        <h4 className="text-sm font-bold text-secondary mb-2 font-mono">Custom Instruction</h4>
        <div className="space-y-2">
          <Textarea
            placeholder="Enter custom 8086 assembly instruction..."
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            className="font-mono text-sm bg-background/50 border-border"
            rows={3}
          />
          <Button 
            onClick={handleCustomSubmit}
            className="w-full font-mono"
            disabled={!customInstruction.trim()}
            variant="secondary"
          >
            Load Custom Instruction
          </Button>
        </div>
      </div>

      {/* Instruction Details */}
      {selectedInstruction && (
        <Card className="p-4 border-border bg-card/30">
          <h4 className="text-sm font-bold text-cpu-control mb-2 font-mono">Instruction Analysis</h4>
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-muted-foreground">Mnemonic:</span>
              <span className="text-primary ml-2">{selectedInstruction}</span>
            </div>
            
            {SAMPLE_INSTRUCTIONS.find(i => i.name === selectedInstruction) && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-mono">
                  {SAMPLE_INSTRUCTIONS.find(i => i.name === selectedInstruction)?.description}
                </div>
                <div>
                  <div className="text-xs font-bold text-cpu-control font-mono mb-1">Microoperations:</div>
                  <div className="space-y-1">
                    {SAMPLE_INSTRUCTIONS.find(i => i.name === selectedInstruction)?.microops.map((microop, idx) => (
                      <div key={idx} className="text-xs font-mono text-muted-foreground flex items-center">
                        <div className="w-2 h-2 rounded-full bg-cpu-control mr-2" />
                        {microop}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
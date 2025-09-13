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
  { name: "MOV AX, BX", description: "Move BX to AX", microops: ["Fetch Operands", "Execute Move", "Update Flags"] },
  { name: "ADD AX, 1000H", description: "Add immediate value to AX", microops: ["Fetch Immediate", "ALU Add", "Update Flags", "Store Result"] },
  { name: "JMP 2000H", description: "Jump to address 2000H", microops: ["Calculate Address", "Update IP"] },
  { name: "CMP AX, BX", description: "Compare AX with BX", microops: ["Fetch Operands", "ALU Compare", "Update Flags"] },
  { name: "PUSH AX", description: "Push AX to stack", microops: ["Decrement SP", "Store to Stack"] },
  { name: "POP BX", description: "Pop from stack to BX", microops: ["Load from Stack", "Increment SP"] }
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
        <div className="grid grid-cols-1 gap-2">
          {SAMPLE_INSTRUCTIONS.map((instr, index) => (
            <Button
              key={index}
              variant={selectedInstruction === instr.name ? "secondary" : "outline"}
              className={cn(
                "justify-start h-auto p-3 font-mono text-xs",
                selectedInstruction === instr.name && "animate-control-pulse"
              )}
              onClick={() => handleSampleSelect(instr.name)}
            >
              <div className="text-left">
                <div className="font-bold text-primary">{instr.name}</div>
                <div className="text-muted-foreground text-xs">{instr.description}</div>
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InstructionEditorProps {
  onInstructionSelect: (instruction: string) => void;
  selectedInstruction: string;
  r1Value: number;
  r2Value: number;
  onR1Change: (value: number) => void;
  onR2Change: (value: number) => void;
}

const SAMPLE_INSTRUCTIONS = [
  { name: "CMP R1, R2", description: "Compare R1 with R2 (Single Bus Organization)", microops: ["PCout, MARin, Read, Select4, Add, Zin", "Zout, PCin, Yin, WMFC", "MDRout, IRin", "R1out, Yin", "R2out, SelectY, Sub, Zin, End"] }
];

export const InstructionEditor = ({ 
  onInstructionSelect, 
  selectedInstruction, 
  r1Value, 
  r2Value, 
  onR1Change, 
  onR2Change 
}: InstructionEditorProps) => {
  const handleSampleSelect = (instruction: string) => {
    onInstructionSelect(instruction);
  };

  return (
    <div className="space-y-4">
      {/* Instruction Selection */}
      <div>
        <h4 className="text-sm font-bold text-secondary mb-2 font-mono">Available Instruction</h4>
        <Button
          variant={selectedInstruction === SAMPLE_INSTRUCTIONS[0].name ? "secondary" : "outline"}
          className={cn(
            "justify-start h-auto p-3 font-mono text-xs w-full",
            selectedInstruction === SAMPLE_INSTRUCTIONS[0].name && "animate-control-pulse"
          )}
          onClick={() => handleSampleSelect(SAMPLE_INSTRUCTIONS[0].name)}
        >
          <div className="text-left">
            <div className="font-bold text-primary text-sm">{SAMPLE_INSTRUCTIONS[0].name}</div>
            <div className="text-muted-foreground text-xs">{SAMPLE_INSTRUCTIONS[0].description}</div>
          </div>
        </Button>
      </div>

      {/* Register Values Editor */}
      <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
        <h4 className="text-sm font-bold text-cpu-register mb-2 font-mono">Register Values</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="r1-value" className="text-sm font-medium font-mono">R1 Value</Label>
            <Input
              id="r1-value"
              type="number"
              value={r1Value}
              onChange={(e) => onR1Change(parseInt(e.target.value) || 0)}
              className="font-mono text-sm"
              min="0"
              max="65535"
              placeholder="0-65535"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r2-value" className="text-sm font-medium font-mono">R2 Value</Label>
            <Input
              id="r2-value"
              type="number"
              value={r2Value}
              onChange={(e) => onR2Change(parseInt(e.target.value) || 0)}
              className="font-mono text-sm"
              min="0"
              max="65535"
              placeholder="0-65535"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Current comparison: R1({r1Value}) vs R2({r2Value})
        </div>
      </div>

      {/* Microinstruction Details */}
      {selectedInstruction && (
        <Card className="p-4 border-border bg-card/30">
          <h4 className="text-sm font-bold text-cpu-control mb-2 font-mono">Microinstruction Steps</h4>
          <div className="space-y-2">
            <div className="font-mono text-sm">
              <span className="text-muted-foreground">Instruction:</span>
              <span className="text-primary ml-2">{selectedInstruction}</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-mono">
                Single Bus Organization - Compare R1 with R2
              </div>
              <div>
                <div className="text-xs font-bold text-cpu-control font-mono mb-1">Control Signal Steps:</div>
                <div className="space-y-1">
                  {SAMPLE_INSTRUCTIONS[0].microops.map((step, idx) => (
                    <div key={idx} className="text-xs font-mono text-muted-foreground flex items-start">
                      <div className="w-4 h-4 rounded-full bg-cpu-control mr-2 flex items-center justify-center text-white text-xs font-bold mt-0.5">{idx + 1}</div>
                      <div>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
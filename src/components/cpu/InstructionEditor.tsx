import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface InstructionEditorProps {
  axValue: number;
  bxValue: number;
  onAxChange: (value: number) => void;
  onBxChange: (value: number) => void;
}

export const InstructionEditor = ({ 
  axValue, 
  bxValue, 
  onAxChange, 
  onBxChange 
}: InstructionEditorProps) => {
  return (
    <div className="space-y-4">
      {/* Instruction Display */}
      <div className="text-center p-3 border border-border rounded-lg bg-card/30">
        <h3 className="text-lg font-mono font-bold text-primary mb-1">CMP AX, BX</h3>
        <p className="text-xs text-muted-foreground font-mono">
          Compare Accumulator with Base Register
        </p>
      </div>

      {/* Register Values Editor */}
      <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
        <h4 className="text-sm font-bold text-cpu-register mb-2 font-mono">Register Values</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ax-value" className="text-sm font-medium font-mono">AX (Accumulator)</Label>
            <Input
              id="ax-value"
              type="number"
              value={axValue}
              onChange={(e) => onAxChange(parseInt(e.target.value) || 0)}
              className="font-mono text-sm"
              min="0"
              max="65535"
              placeholder="0-65535"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bx-value" className="text-sm font-medium font-mono">BX (Base)</Label>
            <Input
              id="bx-value"
              type="number"
              value={bxValue}
              onChange={(e) => onBxChange(parseInt(e.target.value) || 0)}
              className="font-mono text-sm"
              min="0"
              max="65535"
              placeholder="0-65535"
            />
          </div>
        </div>
        <div className="text-xs text-muted-foreground font-mono text-center">
          Will compare AX({axValue}) with BX({bxValue})
        </div>
      </div>

      {/* Operation Details */}
      <Card className="p-4 border-border bg-card/30">
        <h4 className="text-sm font-bold text-cpu-control mb-2 font-mono">Operation Details</h4>
        <div className="space-y-2 text-xs font-mono">
          <div>
            <span className="text-muted-foreground">Operation:</span>
            <span className="text-primary ml-2">AX - BX (Subtraction)</span>
          </div>
          <div>
            <span className="text-muted-foreground">Result:</span>
            <span className="text-secondary ml-2">{axValue - bxValue}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Flags affected:</span>
            <span className="text-cpu-control ml-2">Carry, Zero, Sign</span>
          </div>
        </div>
      </Card>

      {/* 6-Step Process */}
      <Card className="p-4 border-border bg-card/30">
        <h4 className="text-sm font-bold text-cpu-memory mb-2 font-mono">6-Step Execution Process</h4>
        <div className="space-y-1">
          {[
            "IAC - Instruction Address Calculation",
            "IF - Instruction Fetch", 
            "IOD - Instruction Operation Decoding",
            "OAC - Operand Address Calculation",
            "OF - Operand Fetch",
            "DO - Data Operation"
          ].map((step, idx) => (
            <div key={idx} className="text-xs font-mono text-muted-foreground flex items-center">
              <div className="w-4 h-4 rounded-full bg-cpu-control mr-2 flex items-center justify-center text-white text-xs font-bold">{idx + 1}</div>
              <div>{step}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
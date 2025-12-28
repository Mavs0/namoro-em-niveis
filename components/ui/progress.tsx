import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-background/50 border border-retro-blue/30",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-xp-yellow to-pixel-pink transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs pixel-font text-white/80">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };


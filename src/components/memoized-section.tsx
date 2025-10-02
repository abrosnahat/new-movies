"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LazySection } from "@/components/lazy-section";

interface MemoizedSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  lazy?: boolean;
}

const MemoizedSectionComponent = memo(function MemoizedSection({
  title,
  icon,
  children,
  lazy = true,
}: MemoizedSectionProps) {
  const content = (
    <Card className="glass">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          {icon}
          {title}
        </h3>
        {children}
      </CardContent>
    </Card>
  );

  if (lazy) {
    return (
      <LazySection
        fallback={
          <Card className="glass">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        {content}
      </LazySection>
    );
  }

  return content;
});

export { MemoizedSectionComponent as MemoizedSection };

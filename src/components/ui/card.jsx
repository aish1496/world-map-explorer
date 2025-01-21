import React from "react";

export const Card = ({ children, className, ...props }) => (
  <div
    className={`rounded-lg border bg-white shadow-sm ${className || ""}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={`border-b p-4 ${className || ""}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2
    className={`text-lg font-bold text-gray-900 ${className || ""}`}
    {...props}
  >
    {children}
  </h2>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className || ""}`} {...props}>
    {children}
  </div>
);

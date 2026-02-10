"use client";

import React, { createContext, useContext, useRef, useCallback } from "react";

// 生成唯一 ID 的计数器
let globalIdCounter = 0;

// 生成唯一 element ID
export function generateElementId(prefix: string = "el"): string {
  globalIdCounter += 1;
  return `${prefix}-${globalIdCounter.toString(36).padStart(6, "0")}`;
}

// Context 类型
interface ElementIdContextType {
  generateId: (prefix?: string) => string;
}

const ElementIdContext = createContext<ElementIdContextType | null>(null);

// Provider 组件
export function ElementIdProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(0);

  const generateId = useCallback((prefix: string = "el") => {
    counterRef.current += 1;
    return `${prefix}-${Date.now().toString(36)}-${counterRef.current.toString(36).padStart(4, "0")}`;
  }, []);

  return (
    <ElementIdContext.Provider value={{ generateId }}>
      {children}
    </ElementIdContext.Provider>
  );
}

// Hook 使用 element ID
export function useElementId(prefix?: string): string {
  const context = useContext(ElementIdContext);
  const idRef = useRef<string>("");

  if (!idRef.current) {
    if (context) {
      idRef.current = context.generateId(prefix);
    } else {
      idRef.current = generateElementId(prefix);
    }
  }

  return idRef.current;
}

// 高阶组件，自动给组件添加 data-element-id
export function withElementId<P extends object>(
  Component: React.ComponentType<P>,
  prefix?: string
) {
  return function WithElementIdWrapper(props: P) {
    const elementId = useElementId(prefix);
    return (
      <Component
        {...props}
        data-element-id={elementId}
      />
    );
  };
}

// 辅助函数：批量添加 data-element-id 到 React 元素
export function addElementIds(
  children: React.ReactNode,
  prefix: string = "el"
): React.ReactNode {
  let counter = 0;

  function processElement(element: React.ReactNode): React.ReactNode {
    if (!React.isValidElement(element)) {
      return element;
    }

    counter += 1;
    const elementId = `${prefix}-${counter.toString(36).padStart(4, "0")}`;

    // 处理子元素
    const props = element.props as { children?: React.ReactNode };
    const children = props.children;
    let processedChildren = children;
    
    if (React.isValidElement(children)) {
      processedChildren = processElement(children);
    } else if (Array.isArray(children)) {
      processedChildren = children.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            key: (child as React.ReactElement).key || index,
          });
        }
        return child;
      });
    }

    // 克隆元素并添加 data-element-id
    const newProps: Record<string, unknown> = {
      "data-element-id": elementId,
    };
    if (processedChildren !== children) {
      newProps.children = processedChildren;
    }
    return React.cloneElement(element as React.ReactElement, newProps);
  }

  return processElement(children);
}

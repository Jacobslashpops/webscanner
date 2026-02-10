"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Building2, Store, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NewDiagnosisForm, DiagnosisType } from "@/lib/types/diagnosis";

interface NewDiagnosisDialogProps {
  onCreate: (form: NewDiagnosisForm) => Promise<string>;
  children?: React.ReactNode;
}

export function NewDiagnosisDialog({ onCreate, children }: NewDiagnosisDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NewDiagnosisForm>({
    url: "",
    type: "b2b",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewDiagnosisForm, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewDiagnosisForm, string>> = {};

    if (!form.url.trim()) {
      newErrors.url = "请输入网站 URL";
    } else if (!/^https?:\/\/.+/i.test(form.url)) {
      newErrors.url = "URL 格式不正确，请以 http:// 或 https:// 开头";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const id = await onCreate(form);
      setOpen(false);
      // 重置表单
      setForm({ url: "", type: "b2b" });
      // 跳转到分析页面
      router.push(`/dashboard/diagnosis/${id}/analysis`);
    } catch (error) {
      console.error("创建诊断失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button data-element-id="btn-new-diagnosis">
            <Globe className="mr-2 h-4 w-4" />
            新建诊断
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-element-id="new-diagnosis-dialog" className="sm:max-w-lg">
        <DialogHeader data-element-id="new-diagnosis-header">
          <DialogTitle data-element-id="new-diagnosis-title" className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            新建网站诊断
          </DialogTitle>
          <DialogDescription data-element-id="new-diagnosis-desc">
            输入网站 URL 并选择网站类型，开始全面的网站诊断分析。
          </DialogDescription>
        </DialogHeader>

        <div data-element-id="new-diagnosis-form" className="space-y-6 py-4">
          {/* URL 输入 */}
          <div data-element-id="form-url-field" className="space-y-2">
            <Label data-element-id="form-url-label" htmlFor="url">
              网站 URL
            </Label>
            <div data-element-id="form-url-input-wrapper" className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-element-id="form-url-input"
                id="url"
                placeholder="https://example.com"
                className="pl-10"
                value={form.url}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, url: e.target.value }));
                  if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
                }}
              />
            </div>
            {errors.url && (
              <p data-element-id="form-url-error" className="text-sm text-red-500">
                {errors.url}
              </p>
            )}
          </div>

          {/* 类型选择 */}
          <div data-element-id="form-type-field" className="space-y-3">
            <Label data-element-id="form-type-label">网站类型</Label>
            <RadioGroup
              data-element-id="form-type-radio"
              value={form.type}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, type: value as DiagnosisType }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {/* B2B 选项 */}
              <div data-element-id="type-option-b2b">
                <RadioGroupItem
                  data-element-id="type-radio-b2b"
                  value="b2b"
                  id="b2b"
                  className="peer sr-only"
                />
                <Label
                  data-element-id="type-label-b2b"
                  htmlFor="b2b"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Building2 className="mb-3 h-6 w-6" />
                  <div data-element-id="type-b2b-text" className="text-center">
                    <p className="font-medium">B2B 网站</p>
                    <p className="text-xs text-muted-foreground">企业对企业</p>
                  </div>
                </Label>
              </div>

              {/* B2C 选项 */}
              <div data-element-id="type-option-b2c">
                <RadioGroupItem
                  data-element-id="type-radio-b2c"
                  value="b2c"
                  id="b2c"
                  className="peer sr-only"
                />
                <Label
                  data-element-id="type-label-b2c"
                  htmlFor="b2c"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Store className="mb-3 h-6 w-6" />
                  <div data-element-id="type-b2c-text" className="text-center">
                    <p className="font-medium">B2C 网站</p>
                    <p className="text-xs text-muted-foreground">企业对消费者</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 说明文本 */}
          <div data-element-id="form-info" className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p data-element-id="form-info-text">
              诊断将分析网站的结构、内容、SEO、性能和安全性。根据网站类型，我们会使用不同的评估标准。
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div data-element-id="new-diagnosis-actions" className="flex justify-end gap-3">
          <Button
            data-element-id="btn-cancel"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            data-element-id="btn-start-analysis"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                创建中...
              </>
            ) : (
              <>
                开始分析
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

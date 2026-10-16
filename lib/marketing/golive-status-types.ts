export type StepStatus = "pass" | "fail" | "pending" | "deferred" | "optional_pass";

export type VerifiedStep = {
  taskId: string;
  stepId: string;
  key: string;
  status: StepStatus;
  detail: string;
};

export type GoliveStatusReport = {
  checkedAt: string;
  steps: VerifiedStep[];
  summary: {
    pass: number;
    fail: number;
    pending: number;
    deferred: number;
    optionalPass: number;
    total: number;
  };
  freePathNext: { taskId: string; stepId: string; title: string; detail: string } | null;
  signals: {
    gaMeasurementId: boolean;
    gtmId: boolean;
    posthogKey: boolean;
    gscVerification: boolean;
    instantlyWebhookSecret: boolean;
    instantlyApiKey: boolean;
    openaiKey: boolean;
    resendConfigured: boolean;
    attributionColumns: boolean;
    leadsReadable: boolean;
    attributedLeadExists: boolean;
  };
};

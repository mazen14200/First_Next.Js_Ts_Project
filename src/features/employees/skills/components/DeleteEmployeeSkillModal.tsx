"use client";

import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface DeleteEmployeeSkillModalProps {
  open: boolean;
  skillName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteEmployeeSkillModal = ({
  open,
  skillName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteEmployeeSkillModalProps) => {
  const t = useTranslations("employeeSkills");

  return (
    <Modal
      open={open}
      title={t("deleteTitle")}
      onCancel={onClose}
      onOk={onConfirm}
      okText={t("delete")}
      cancelText={t("cancel")}
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isDeleting}
      centered
      destroyOnHidden
    >
      <div className="flex items-start gap-4 py-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <ExclamationCircleOutlined className="text-lg" />
        </div>

        <div>
          <p className="text-sm leading-6 text-slate-600">
            {t("deleteConfirmation")}
          </p>

          {skillName && (
            <p className="mt-2 font-semibold text-slate-800">
              {skillName}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEmployeeSkillModal;
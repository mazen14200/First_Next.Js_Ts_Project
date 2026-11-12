"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useCrudList } from "@/hooks/useCrudList";
import {
  ConfirmModal,
  DataTable,
  FormModal,
} from "@/components/shared";
import type { DataTableColumn } from "@/components/shared";
import TableHeader from "@/components/ui/TableHeader/TableHeader";
import FilterSelect from "@/components/ui/FilterSelect/FilterSelect";
import { pickLocalized } from "@/utils/localized";

import type {
  CreateSkillRequest,
  Skill,
  SkillFilters,
  UpdateSkillRequest,
} from "@/features/skills/types/skills.types";

import { skillsClient } from "@/features/skills/services/skills.client";
import {
  skillFields,
  toSkillFormValues,
  toSkillPayload,
} from "@/features/skills/config/skills.fields";

const SkillsPage = () => {
  const locale = useLocale();
  const t = useTranslations("skills");

  const crud = useCrudList<
    Skill,
    CreateSkillRequest,
    UpdateSkillRequest,
    SkillFilters
  >({
    client: skillsClient,
    initialFilters: {},
  });

  const [toggleTarget, setToggleTarget] = useState<Skill | null>(
    null
  );
  const [updatingStatusId, setUpdatingStatusId] = useState<
    number | null
  >(null);

  const getSkillName = (skill: Skill) =>
    pickLocalized(locale, skill.nameAr, skill.nameEn);

  const draftIsActive =
    crud.query.draftFilters.isActive;

  const statusFilterValue =
    draftIsActive === true
      ? "active"
      : draftIsActive === false
        ? "inactive"
        : "";

  const handleStatusFilterChange = (value: unknown) => {
    const selected = value === "active"
      ? true
      : value === "inactive"
        ? false
        : undefined;

    crud.actions.setDraftFilters({ isActive: selected });
  };

  const handleToggleConfirm = async () => {
    if (!toggleTarget) {
      return;
    }

    const skill = toggleTarget;
    const nextActive = !skill.isActive;

    setUpdatingStatusId(skill.id);

    try {
      await skillsClient.setActive(skill.id, nextActive);
      setToggleTarget(null);
      crud.actions.reload();
    } catch (error) {
      console.error("Failed to update skill status:", error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const columns: DataTableColumn<Skill>[] = [
    {
      key: "name",
      header: t("skill"),
      pill: true,
      cell: (skill) => getSkillName(skill),
    },
    {
      key: "description",
      header: t("descriptionLabel"),
      accessor: "description",
      maxWidth: 420,
    },
    {
      key: "status",
      header: t("status"),
      width: "10rem",
      cell: (skill) => {
        const isUpdating = updatingStatusId === skill.id;

        return (
          <button
            type="button"
            onClick={() => setToggleTarget(skill)}
            disabled={isUpdating}
            className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              skill.isActive
                ? "bg-emerald-500 hover:bg-emerald-600 hover:ring-4 hover:ring-emerald-100"
                : "bg-slate-200 hover:bg-slate-300 hover:ring-4 hover:ring-slate-100"
            }`}
            title={
              skill.isActive ? t("deactivate") : t("activate")
            }
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                skill.isActive ? "start-1" : "end-1"
              }`}
            />
          </button>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-5">
        <TableHeader
          title={t("title")}
          description={t("description")}
          recordCount={crud.data.totalCount}
          currentPage={crud.query.page}
          pageSize={crud.query.pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageSizeChange={crud.actions.setPageSize}
          onApplyFilters={crud.actions.apply}
          onResetFilters={crud.actions.reset}
          filters={
            <FilterSelect
              label={t("status")}
              value={statusFilterValue}
              onChange={handleStatusFilterChange}
              options={[
                { value: "", label: t("allStatuses") },
                { value: "active", label: t("active") },
                { value: "inactive", label: t("inactive") },
              ]}
            />
          }
          onAdd={crud.form.openCreate}
        />

        <DataTable
          columns={columns}
          rows={crud.data.items}
          rowKey={(skill) => skill.id}
          loading={crud.status.loading}
          refreshing={crud.status.refreshing}
          onEdit={crud.form.openEdit}
          onDelete={crud.remove.request}
          getRowLabel={getSkillName}
          labels={{
            actions: t("actions"),
            edit: t("edit"),
            delete: t("delete"),
            emptyTitle: t("emptyTitle"),
            emptyDescription: t("emptyDescription"),
          }}
          pagination={{
            currentPage: crud.query.page,
            pageSize: crud.query.pageSize,
            total: crud.data.totalCount,
            onPageChange: crud.actions.setPage,
            onPageSizeChange: crud.actions.setPageSize,
          }}
        />
      </div>

      <FormModal<Skill, CreateSkillRequest | UpdateSkillRequest>
        key={crud.form.entity?.id ?? "new"}
        open={crud.form.open}
        entity={crud.form.entity}
        fields={skillFields({
          arabicName: t("arabicName"),
          nameArPlaceholder: t("nameArPlaceholder"),
          englishName: t("englishName"),
          nameEnPlaceholder: t("nameEnPlaceholder"),
          descriptionLabel: t("descriptionLabel"),
          descriptionPlaceholder: t("descriptionPlaceholder"),
        })}
        toFormValues={toSkillFormValues}
        toPayload={toSkillPayload}
        onSubmit={crud.form.submit}
        onClose={crud.form.close}
        labels={{
          createTitle: t("addSkill"),
          editTitle: t("editSkill"),
          description: t("modalDescription"),
          submit: t("save"),
          update: t("update"),
          cancel: t("cancel"),
          saving: t("saving"),
        }}
      />

      <ConfirmModal
        open={Boolean(crud.remove.target)}
        title={t("deleteSkill")}
        message={t("deleteConfirmation")}
        itemLabel={
          crud.remove.target
            ? getSkillName(crud.remove.target)
            : undefined
        }
        confirmLabel={t("confirmDelete")}
        cancelLabel={t("cancel")}
        variant="danger"
        loading={crud.remove.isDeleting}
        onConfirm={async () => {
          try {
            await crud.remove.confirm();
          } catch {
            // Error already reported via onError
          }
        }}
        onClose={crud.remove.cancel}
      />

      <ConfirmModal
        open={Boolean(toggleTarget)}
        title={
          toggleTarget?.isActive
            ? t("deactivateSkill")
            : t("activateSkill")
        }
        message={
          toggleTarget?.isActive
            ? t("deactivateConfirmation")
            : t("activateConfirmation")
        }
        itemLabel={
          toggleTarget ? getSkillName(toggleTarget) : undefined
        }
        confirmLabel={
          toggleTarget?.isActive
            ? t("deactivate")
            : t("activate")
        }
        cancelLabel={t("cancel")}
        variant={toggleTarget?.isActive ? "danger" : "primary"}
        loading={updatingStatusId !== null}
        onConfirm={handleToggleConfirm}
        onClose={() => {
          if (updatingStatusId === null) {
            setToggleTarget(null);
          }
        }}
      />
    </>
  );
};

export default SkillsPage;

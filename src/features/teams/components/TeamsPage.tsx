"use client";

import { useLocale, useTranslations } from "next-intl";

import { useCrudList } from "../../../hooks/useCrudList";
import {
  ConfirmModal,
  DataTable,
  FormModal,
} from "../../../components/shared";
import type { DataTableColumn } from "../../../components/shared";
import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import { pickLocalized } from "../../../utils/localized";

import type {
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "../types/team.types";

import { teamsClient } from "../services/teams.client";
import {
  teamFields,
  toTeamFormValues,
  toTeamPayload,
} from "../config/teams.fields";

const TeamsPage = () => {
  const locale = useLocale();
  const t = useTranslations("teams");

  const crud = useCrudList({ client: teamsClient });

  const getTeamName = (team: Team) =>
    pickLocalized(locale, team.nameAR, team.nameEN);

  const columns: DataTableColumn<Team>[] = [
    {
      key: "name",
      header: t("name"),
      pill: true,
      cell: (team) => getTeamName(team),
    },
    {
      key: "rate",
      header: t("rate"),
      accessor: "rate",
      pill: true,
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
          onAdd={crud.form.openCreate}
        />

        <DataTable
          columns={columns}
          rows={crud.data.items}
          rowKey={(team) => team.id}
          loading={crud.status.loading}
          refreshing={crud.status.refreshing}
          onEdit={crud.form.openEdit}
          onDelete={crud.remove.request}
          getRowLabel={getTeamName}
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

      <FormModal<Team, CreateTeamRequest | UpdateTeamRequest>
        key={crud.form.entity?.id ?? "new"}
        open={crud.form.open}
        entity={crud.form.entity}
        fields={teamFields({
          nameAR: t("nameAR"),
          nameARPlaceholder: t("nameARPlaceholder"),
          nameEN: t("nameEN"),
          nameENPlaceholder: t("nameENPlaceholder"),
          rate: t("rate"),
          ratePlaceholder: t("ratePlaceholder"),
        })}
        toFormValues={toTeamFormValues}
        toPayload={toTeamPayload}
        onSubmit={crud.form.submit}
        onClose={crud.form.close}
        labels={{
          createTitle: t("addTeam"),
          editTitle: t("editTeam"),
          description: t("modalDescription"),
          submit: t("save"),
          update: t("update"),
          cancel: t("cancel"),
          saving: t("saving"),
        }}
      />

      <ConfirmModal
        open={Boolean(crud.remove.target)}
        title={t("deleteTeam")}
        message={t("deleteConfirmation")}
        itemLabel={
          crud.remove.target
            ? getTeamName(crud.remove.target)
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
    </>
  );
};

export default TeamsPage;

import React from "react";
import { Bullseye, Label, ModalVariant } from "@patternfly/react-core";
import { IconButton, TagGroup, Tag, Loader } from "rsuite";
import {Plus} from "@rsuite/icons"
import { sortable, classNames, Visibility } from "@patternfly/react-table";

import Table from "@components/Tables/GenericTable";
import Fuse from "fuse.js";
import { HeaderToolbar } from "@components/Tables/HeaderToolbar";
import { FooterToolbar } from "@components/Tables/FooterToolbar";

import ModalForm from "@components/Froms/ModalForms";
import DeleteModal from "@components/shared/modals/DeleteModal";

import _ from "lodash";
import { useEntity } from "../../../graphql";
import {
  validateAtLeastOneOptionRequired,
  validateBoolean,
  validateEmail,
  validateString,
  validateUsername,
} from "@components/Froms/Utils";

import { hashCode } from "../../../utils/general/stringHash";

import { Role, User } from "@gqlauto/schemas";

import {
  GetUserAndRolesDocument,
  CreateUserDocument,
  UpdateUserDocument,
  DeleteUserDocument,
} from "@gqlauto/hooks";
import { TypeAttributes } from "rsuite/esm/@types/common";

const TAGS_COLORS: TypeAttributes.Color[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "violet",
];

//=============================================================================
//#region Table configuration

export const ENTITY_NAME = "User";

export const COLUMNS = [
  {
    key: "id",
    title: "Id",
    transforms: [sortable],
    columnTransforms: [classNames(Visibility.hidden || "")],
  },
  { key: "username", title: "Username", transforms: [sortable] },
  { key: "password", title: "Password", transforms: [sortable] },
  { key: "email", title: "Email", transforms: [sortable] },
  { key: "firstName", title: "First Name", transforms: [sortable] },
  { key: "lastName", title: "Last Name", transforms: [sortable] },
  { key: "enabled", title: "Enabled", transforms: [sortable] },
  { key: "rolesName", title: "Roles", transforms: [sortable] },
];

const FUSE_OPTIONS = {
  keys: COLUMNS.map((c) => c.key),
};

function transformRows(items: any[]) {
  if (items === undefined) return [];
  return items.map((item) => ({
    cells: COLUMNS.map((column) => {
      if (column.key === "rolesName") {
        return {
          title: item?.rolesName ? (
            <TagGroup>
              {item.rolesName.map((r: string) => (
                <Tag
                  key={r}
                  color={TAGS_COLORS[hashCode(r) % TAGS_COLORS.length]}
                >
                  {r}
                </Tag>
              ))}
            </TagGroup>
          ) : (
            ""
          ),
        };
      } else if (column.key === "enabled") {
        let label = _.get(item, column.key, false);
        const className = label ? "greenLabel" : "normalLabel";
        return {
          title: <Label className={className}>{label ? "YES" : "NO"}</Label>,
        };
      } else return _.get(item, column.key);
    }),
  }));
}

const POSIBLE_LIMITS_PER_PAGE = [10, 25, 50, 100];

//#endregion
//=============================================================================

interface EntityPageState {
  currentPage: number;
  pageLimit: number;
  searchText: string;
  isCreateUpdateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  entity?: User;
  items: User[];
  roles: Role[];
}

const UsersPage: React.FC = () => {
  const [state, setState] = React.useState<EntityPageState>({
    currentPage: 1,
    pageLimit: POSIBLE_LIMITS_PER_PAGE[POSIBLE_LIMITS_PER_PAGE.length - 1],
    searchText: "",
    isCreateUpdateModalOpen: false,
    isDeleteModalOpen: false,
    entity: undefined,
    items: [],
    roles: [],
  });

  const { currentPage, pageLimit } = state;
  const offset = (currentPage - 1) * pageLimit;

  const { loading, createItem, updateItem, removeItem } = useEntity<User>({
    entityName: ENTITY_NAME,
    get: GetUserAndRolesDocument,
    create: CreateUserDocument,
    update: UpdateUserDocument,
    remove: DeleteUserDocument,
    onChange: ({ items, data }) => {
      const newItems = items.map((i) => ({
        ...i,
        rolesName: i?.roles?.filter(r => _.find(data?.roles, { id: r.id })).map(r => r.name),
      }));
      setState({ ...state, items: newItems, roles: data?.roles || [] });
    },
  });

  //===========================================================================
  //#region events

  const onPageLimitChanged = (n: number) => {
    setState({
      ...state,
      pageLimit: n,
      currentPage: 1,
    });
  };

  const onPageChanged = (page: number) => {
    setState({ ...state, currentPage: page });
  };

  const handleUpdateFilterInput = (searchText?: string) =>
    setState({ ...state, searchText: searchText || "" });

  const onCloseAnyModal = () =>
    setState({
      ...state,
      isCreateUpdateModalOpen: false,
      isDeleteModalOpen: false,
    });

  const onCreate = () => {
    setState({ ...state, entity: undefined, isCreateUpdateModalOpen: true });
  };
  const onEdit = (id: string) => {
    const entity = _.find(state.items, (i) => i.id === id);
    setState({ ...state, entity, isCreateUpdateModalOpen: true });
  };

  const onDelete = (id: string) => {
    const entity = _.find(state.items, (i) => i.id === id);
    setState({ ...state, entity, isDeleteModalOpen: true });
  };

  //#endregion
  //===========================================================================

  //===========================================================================
  //#region Table elements filter by search and pagination

  const fuse = new Fuse(state.items, FUSE_OPTIONS);
  const tableItems = state.searchText
    ? fuse
        .search(state.searchText)
        .map((m) => m.item)
        .slice(offset, offset + pageLimit)
    : state.items.slice(offset, offset + pageLimit);
  //#endregion
  //===========================================================================

  return (
    <>
      {loading ? (
        <Bullseye>
          <Loader
            size="lg"
            speed="slow"
            content="loading..."
            className="spinner"
          />
        </Bullseye>
      ) : (
        <>
          <HeaderToolbar
            hasFilter={true}
            hasDateTimeFilter={false}
            handleUpdateFilterInput={handleUpdateFilterInput}
            hasCreateEntity={true}
            CreateEntityChild={
              <IconButton icon={<Plus />} onClick={onCreate}>
                {`Create ${ENTITY_NAME}`}
              </IconButton>
            }
          />
          {state.isCreateUpdateModalOpen && (
            <ModalForm
              title={state.entity ? "Update Author" : "Create Author"}
              modalVariant={ModalVariant.small}
              fields={[
                {
                  keyName: "username",
                  label: "Username",
                  helperText: "Insert username",
                  helperTextInvalid:
                    'Text must be at least 4 characters long and must not begin or end with "." or "_" and does not contain spaces or special characters other than "-" or "_"',
                  inputControl: {
                    required: true,
                    validate: validateUsername,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "firstName",
                  label: "First Name",
                  helperText: "Please enter User's first name",
                  helperTextInvalid: "It has to be at least one word",
                  inputControl: {
                    required: true,
                    validate: validateString,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "lastName",
                  label: "Last Name",
                  helperText: "Please enter User's last name",
                  helperTextInvalid: "It has to be at least one word",
                  inputControl: {
                    required: true,
                    validate: validateString,
                  },
                  type: "TextInput",
                  textInputType: "text",
                },
                {
                  keyName: "email",
                  label: "Email",
                  helperText: "Please enter User's email",
                  helperTextInvalid:
                    "The email must be in the format: xxx@xxx.xxx",
                  inputControl: {
                    required: true,
                    validate: validateEmail,
                  },
                  type: "TextInput",
                  textInputType: "email",
                },
                {
                  keyName: "enabled",
                  label: "Is Enable?",
                  helperText: "Select if user is currently enabled",
                  helperTextInvalid: "Active means that the user is enabled",
                  inputControl: {
                    required: false,
                    validate: validateBoolean,
                  },
                  type: "ToggleSwitch",
                },
                {
                  keyName: "roles",
                  label: "Select user's roles",
                  helperText: "Please select the User's Role",
                  helperTextInvalid: "At least one role must be selected",
                  inputControl: {
                    required: true,
                    validate: validateAtLeastOneOptionRequired,
                  },
                  type: "MultiSelectWithFilter",
                  options: (state.roles || []).map((a: any) => ({
                    id: a.id,
                    value: a.name,
                  })),
                  direction: "up",
                },
              ]}
              onClose={onCloseAnyModal}
              entity={state.entity}
              create={createItem}
              update={updateItem}
            />
          )}
          {state.isDeleteModalOpen && removeItem && (
            <DeleteModal
              entityName={ENTITY_NAME}
              onClose={onCloseAnyModal}
              entity={state.entity}
              rm={removeItem}
            />
          )}
          <Table
            columns={COLUMNS}
            items={tableItems}
            onDelete={onDelete}
            onEdit={onEdit}
            transformRows={transformRows}
          />
          <div className="pagination-footer">
            <FooterToolbar
              totalRecords={state.items.length}
              pageLimit={pageLimit}
              currentPage={currentPage}
              posibleLimitsPerPage={POSIBLE_LIMITS_PER_PAGE}
              onPageLimitChanged={onPageLimitChanged}
              onPageChanged={onPageChanged}
            />
          </div>
        </>
      )}
    </>
  );
};

export default UsersPage;

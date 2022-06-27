import React from 'react';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { SelectionOption } from '../Utils';

interface Props {
  keyName: string;
  label: string;
  selected?: string;
  options: SelectionOption[];
  handleChangeSelected: (selected?: string) => void;
  direction?: 'up' | 'down';
}

interface State {
  isOpen: boolean;
  isDisabled: boolean;
  isCreatable: boolean;
  hasOnCreateOption: boolean;
}

const SelectWithFilter: React.FC<Props> = (props) => {
  const { keyName, label, selected, options, handleChangeSelected, direction } = props;
  const [state, setState] = React.useState<State>({
    isOpen: false,
    isDisabled: false,
    isCreatable: false,
    hasOnCreateOption: false,
  });

  const onToggle = (isOpen: boolean) => {
    setState({
      ...state,
      isOpen,
    });
  };

  const onSelect = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean | undefined,
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      handleChangeSelected(selection.toString());
      setState({
        ...state,
        isOpen: false,
      });
    }
  };

  const clearSelection = () => {
    handleChangeSelected();
    setState({
      ...state,
      isOpen: false,
    });
  };

  const { isDisabled, isCreatable } = state;
  return (
    <div>
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={label}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected}
        isOpen={state.isOpen}
        aria-labelledby={keyName}
        placeholderText={label}
        isDisabled={isDisabled}
        isCreatable={isCreatable}
        menuAppendTo={() => document.body}
        direction={direction}
      >
        {options.map((option, index) => (
          <SelectOption
            isDisabled={option.disabled}
            key={index}
            value={option.value}
            {...(option.description && { description: option.description })}
          />
        ))}
      </Select>
    </div>
  );
};

export default SelectWithFilter;

import React, { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';

const Autocomplete = props => {

  const element = useRef();

  const [ inputItems, setInputItems ] = useState(props.vocabulary || []);

  useEffect(() => {
    if (props.initialValue)
      element.current.querySelector('input').value = props.initialValue;
      
    if (props.focus)
      element.current.querySelector('input').focus({ preventScroll: true });
  }, [])
  
  const onInputValueChange = ({ inputValue }) => {
    if (inputValue.length > 0) {
      const prefixMatches = props.vocabulary.filter(item => {
        return item.toLowerCase().startsWith(inputValue.toLowerCase());
      });

      setInputItems(prefixMatches);
    } else {
      // ...or none, if the input is empty
      setInputItems([]);
    }      
  }

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setInputValue
  } = useCombobox({ 
    items: inputItems, 
    onInputValueChange: onInputValueChange, 
    onSelectedItemChange: ({ inputValue }) => {
      onSubmit(inputValue);
      setInputValue('');
    } 
  });

  const onSubmit = inputValue => {
    setInputValue('');
    if (inputValue.trim().length > 0)
      props.onSubmit(inputValue);
  }

  const onKeyUp = evt => {
    const { value } = evt.target;
    
    if (evt.which == 13 && highlightedIndex == -1) {
      onSubmit(value);
    } else if (evt.which == 40 && value.length == 0) {
      setInputItems(props.vocabulary); // Show all options on key down
    } else if (evt.which == 27) {
      props.onCancel && props.onCancel();
    } else {
      props.onChange && props.onChange(value);
    }
  }

  return (
    <div className="r6o-autocomplete" ref={element}>
      <div {...getComboboxProps()}>
        <input 
          {...getInputProps({ onKeyUp })}
          placeholder={props.placeholder} />
      </div>
      <ul {...getMenuProps()}>
        {isOpen && inputItems.map((item, index) => (
          <li style={
                highlightedIndex === index
                  ? { backgroundColor: '#bde4ff' }
                  : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
  
}

export default Autocomplete;

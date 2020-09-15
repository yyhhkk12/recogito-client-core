import React from 'preact/compat';
import { useState } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

const getDraftTag = existingDraft =>
  existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: 'tagging', draft: true
  };

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  // All tags (draft + non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(b => b.type === 'TextualBody' && b.purpose === 'tagging') : [];

  // Last draft tag goes into the input field
  const draftTag = getDraftTag(all.slice().reverse().find(b => b.draft)); 

  // All except draft tag
  const tags = all.filter(b => b != draftTag);

  const [ showDelete, setShowDelete ] = useState(false);

  const toggle = tag => _ => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDelete = tag => evt => {
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

  const onDraftChange = evt => {
    const prev = draftTag.value.trim();
    const updated = evt.target.value.trim();

    if (prev.length === 0 && updated.length > 0) {
      props.onAppendBody({ ...draftTag, value: updated });
    } else if (prev.length > 0 && updated.length === 0) {
      props.onRemoveBody(draftTag);
    } else {
      props.onUpdateBody(draftTag, { ...draftTag, value: updated });
    }
  }

  const onSubmit = tag => {
    // Just 'undraft' the current draft tag
    const { draft, ...undrafted } = draftTag;
    props.onUpdateBody(draftTag, undrafted);
  }

  return (
    <div className="r6o-widget tag">
      <div>
        { tags.length > 0 &&
          <ul className="r6o-taglist">
            { tags.map(tag =>
              <li key={tag.value} onClick={toggle(tag.value)}>
                <span className="label">{tag.value}</span>

                {!props.readOnly &&
                  <CSSTransition in={showDelete === tag.value} timeout={200} classNames="delete">
                    <span className="delete-wrapper" onClick={onDelete(tag)}>
                      <span className="delete">
                        <CloseIcon width={12} />
                      </span>
                    </span>
                  </CSSTransition>
                }
              </li>
            )}
          </ul>
        }
      </div>

      {!props.readOnly &&
        <Autocomplete
          placeholder={i18n.t('Add tag...')}
          initialValue={draftTag.value}
          onChange={onDraftChange}
          onSubmit={onSubmit}
          vocabulary={props.vocabulary || []} />
      }
    </div>
  )

};

export default TagWidget;

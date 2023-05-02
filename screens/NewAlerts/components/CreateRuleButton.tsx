import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRuleButton = ({
  isEditing,
  onClick,
}: {
  isEditing: boolean;
  onClick: () => void;
}): ReactElement => {
  const navigate = useNavigate();
  return (
    <div className="create-rule-button">
      <button className="button" onClick={() => navigate('/alerts')}>
        Cancel
      </button>
      <button className="button button--blue" onClick={onClick}>
        {isEditing ? 'Update' : 'Create'} Rule
      </button>
    </div>
  );
};

export default CreateRuleButton;

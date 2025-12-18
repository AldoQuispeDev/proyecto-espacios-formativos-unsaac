import React from 'react';
import PropTypes from 'prop-types';
import './Icon.css';

const Icon = ({ 
  name, 
  size = 'md', 
  color, 
  className = '', 
  onClick,
  title 
}) => {
  const sizeClass = `icon-${size}`;
  const colorClass = color ? `text-${color}` : '';
  const iconClass = `bi bi-${name}`;
  
  return (
    <i 
      className={`${iconClass} ${sizeClass} ${colorClass} ${className}`.trim()}
      onClick={onClick}
      title={title}
      aria-hidden={!title}
      role={onClick ? 'button' : undefined}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string
};

export default Icon;

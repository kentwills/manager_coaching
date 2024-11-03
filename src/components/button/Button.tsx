import React from 'react';
import './Button.scss';

import { Icon } from 'react-feather';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: Icon;
  iconPosition?: 'start' | 'end';
  iconColor?: 'red' | 'green' | 'grey';
  iconFill?: boolean;
  buttonStyle?: 'regular' | 'action' | 'alert' | 'flush';
  children?: React.ReactNode;
}

export function Button({
  icon = undefined,
  iconPosition = 'start',
  iconColor = undefined,
  iconFill = false,
  buttonStyle = 'regular',
  children,
  ...rest
}: ButtonProps) {
  const StartIcon = iconPosition === 'start' ? icon : null;
  const EndIcon = iconPosition === 'end' ? icon : null;
  const classList = [];
  if (iconColor) {
    classList.push(`icon-${iconColor}`);
  }
  if (iconFill) {
    classList.push(`icon-fill`);
  }
  classList.push(`button-style-${buttonStyle}`);

  return (
    <button data-component="Button" className={classList.join(' ')} {...rest}>
      {StartIcon && (
        <span className="icon icon-start">
          <StartIcon />
        </span>
      )}
      {children && <span className="label">{children}</span>}
      {EndIcon && (
        <span className="icon icon-end">
          <EndIcon />
        </span>
      )}
    </button>
  );
}
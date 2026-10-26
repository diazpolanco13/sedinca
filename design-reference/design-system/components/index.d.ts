import type * as React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> { tone?: 'operational' | 'standby'; live?: boolean; children?: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export declare function Input(props: InputProps): React.ReactElement;
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Radio(props: RadioProps): React.ReactElement;
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { elevation?: 'card' | 1 | 2 | 3; accent?: boolean; children?: React.ReactNode }
export declare function Card(props: CardProps): React.ReactElement;
declare global { interface Window { Sedin: { Button: typeof Button; Chip: typeof Chip; Input: typeof Input; Checkbox: typeof Checkbox; Radio: typeof Radio; Card: typeof Card } } }

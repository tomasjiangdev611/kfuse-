import classnames from 'classnames';
import React, {
  ForwardedRef,
  forwardRef,
  FunctionComponent,
  ReactNode,
} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  [x: string]: unknown;
};

type PropsWithShouldRenderDiv = {
  shouldRenderDiv?: boolean;
} & Props;

const createTableElement = (render: FunctionComponent<Props>) => {
  const Component = (
    { shouldRenderDiv, ...props }: PropsWithShouldRenderDiv,
    ref: ForwardedRef<HTMLDivElement>,
  ) =>
    shouldRenderDiv ? (
      <div
        {...props}
        ref={ref}
        className={classnames({
          table__div: true,
          [props.className]: props.className,
        })}
      >
        {props.children}
      </div>
    ) : (
      render(props, ref)
    );
  return forwardRef<HTMLDivElement>(Component);
};

export const TableElement = createTableElement((props: Props) => (
  <table {...props}>{props.children}</table>
));

export const TheadElement = createTableElement((props: Props) => (
  <thead {...props}>{props.children}</thead>
));

export const TbodyElement = createTableElement((props: Props) => (
  <tbody {...props}>{props.children}</tbody>
));

export const TrElement = createTableElement((props: Props) => (
  <tr {...props}>{props.children}</tr>
));

export const TdElement = createTableElement((props: Props) => (
  <td {...props}>{props.children}</td>
));

export const ThElement = createTableElement((props: Props, ref) => (
  <th ref={ref} {...props}>
    {props.children}
  </th>
));

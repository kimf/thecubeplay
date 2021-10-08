import * as React from 'react';
import debounce from 'lodash.debounce';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { BoxSide } from './Box';

const MUTATION = gql`
  mutation UpdateSide($id: ID!, $green: Int!, $red: Int!, $blue: Int!) {
    updateSide(side: { id: $id, green: $green, red: $red, blue: $blue }) {
      id
    }
  }
`;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const red = parseInt(result[1], 16);
    const green = parseInt(result[2], 16);
    const blue = parseInt(result[3], 16);
    return { red, green, blue };
  }
  return { red: 0, green: 0, blue: 0 };
};

const Controls = ({ sides }: { sides: BoxSide[] }) => {
  const [mutateFunction] = useMutation(MUTATION);

  const debouncedUpdateColor = React.useMemo(
    () =>
      debounce((id: string, color: string) => {
        const { red, green, blue } = hexToRgb(color);
        console.log(id, color, red, green, blue);
        mutateFunction({ variables: { id, red, green, blue } });
      }, 450),
    [mutateFunction],
  );
  return (
    <div className="control-panel">
      <h2>Controls</h2>
      {sides.map((side) => (
        <label key={`label-${side.id}`}>
          <span>{side.id}</span>
          <input
            type="color"
            key={`slider-${side.id}`}
            value={side.hex}
            onChange={(event) => debouncedUpdateColor(side.id, event.target.value)}
          />
        </label>
      ))}
    </div>
  );
};

export default Controls;

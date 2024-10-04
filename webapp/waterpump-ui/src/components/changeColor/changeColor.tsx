import { useState } from 'react';

function ColorBox() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: isActive ? 'blue' : 'gray',
        margin: '10px',
        cursor: 'pointer',
      }}
    ></div>
  );
}

function ChangeColor() {
  return (
    <div style={{ display: 'flex' }}>
      <ColorBox />
      <ColorBox />
      <ColorBox />
    </div>
  );
}

export default ChangeColor;

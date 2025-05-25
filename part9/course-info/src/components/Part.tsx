import { type CoursePart } from '../types';

const Part = ({ part }: { part: CoursePart }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const renderExtras = () => {
    switch (part.kind) {
      case 'basic':
        return (
          <div>
            <em>{part.description}</em>
          </div>
        );

      case 'group':
        return <div>project exercises {part.groupProjectCount}</div>;

      case 'background':
        return (
          <>
            <div>
              <em>{part.description}</em>
            </div>
            <div>submit to: {part.backgroundMaterial}</div>
          </>
        );

      case 'special':
        return (
          <>
            <div>
              <em>{part.description}</em>
            </div>
            <div>required skills: {part.requirements.join(', ')}</div>
          </>
        );
      default:
        return assertNever(part);
    }
  };

  return (
    <div>
      <div>
        <strong>
          {part.name} {part.exerciseCount}
        </strong>
        {renderExtras()}
      </div>
      <br />
    </div>
  );
};

export default Part;

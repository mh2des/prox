import PrincipleForm from '../PrincipleForm';
import { createPrinciple } from '../actions';

export default function NewPrinciple() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Entry</h1>
          <p className="admin-page-sub">Add a vision, mission, or value.</p>
        </div>
      </div>
      <PrincipleForm action={createPrinciple} />
    </>
  );
}

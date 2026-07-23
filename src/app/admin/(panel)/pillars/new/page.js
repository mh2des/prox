import PillarForm from '../PillarForm';
import { createPillar } from '../actions';

export default function NewPillar() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Pillar</h1>
          <p className="admin-page-sub">Add a TRACE service pillar.</p>
        </div>
      </div>
      <PillarForm action={createPillar} />
    </>
  );
}

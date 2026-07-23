import SectorForm from '../SectorForm';
import { createSector } from '../actions';

export default function NewSector() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Sector</h1>
          <p className="admin-page-sub">Add a sector.</p>
        </div>
      </div>
      <SectorForm action={createSector} />
    </>
  );
}

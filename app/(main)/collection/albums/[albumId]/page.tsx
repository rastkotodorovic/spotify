import SelectedAlbum from "../../../../../components/album/SelectedAlbum";

export const dynamic = "force-dynamic"; // equivalent intent to SSR (no static caching)

export default function AlbumPage() {
    return <SelectedAlbum />;
}

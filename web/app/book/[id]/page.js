"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const BookDetails = dynamic(
  () => import("../../Components/BookDetails/BookDetails"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const BookPage = () => {
  const { id } = useParams();
  return <BookDetails bookId={id} />;
};

export default BookPage;
"use client";

import { useParams } from "next/navigation";
import BookDetails from '../../Components/BookDetails/BookDetails';

const BookPage = () => {
  const { id } = useParams();
  return <BookDetails bookId={id} />;
};

export default BookPage;
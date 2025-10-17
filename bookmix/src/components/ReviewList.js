import { getCurrentUser } from "../utils/userUtils";

const ReviewList = ({ reviews, deletingId, onDelete }) => {
  return (
    <ul className='reviewsList'>
      {reviews.map((rev) => {
        const isMyReview = getCurrentUser()?.id_user === rev.user_id;
        return (
          <li key={rev.id_review} className='reviewItem'>
            <div className='reviewHeader'>
              <strong>{rev.firstname} {rev.lastname}</strong>
              <span>Оценка: {rev.rating}</span>
              <span>{new Date(rev.reviewdate).toLocaleDateString()}</span>
              {isMyReview && (
                <button
                  className='reviewDeleteBtn'
                  onClick={() => onDelete(rev.id_review)}
                  disabled={deletingId === rev.id_review}
                >
                  {deletingId === rev.id_review ? '…' : '✕'}
                </button>
              )}
            </div>
            <div className='reviewComment'>{rev.usercomment}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default ReviewList;

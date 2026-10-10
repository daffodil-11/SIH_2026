from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Alias, Post
from app.schemas import PostResponse

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("/", response_model=list[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts


@router.get("/alias/{alias_id}", response_model=list[PostResponse])
def get_posts_by_alias(alias_id: int, db: Session = Depends(get_db)):
    alias = db.query(Alias).filter(Alias.id == alias_id).first()

    if alias is None:
        raise HTTPException(status_code=404, detail="Alias not found")

    posts = db.query(Post).filter(Post.alias_id == alias_id).all()
    return posts
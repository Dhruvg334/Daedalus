from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ...core.database import get_db
from ...models.progress import UserProgress
from ...schemas.progress import ProgressUpdate, ProgressResponse

router = APIRouter()

@router.get("/{simulation_id}", response_model=ProgressResponse)
async def get_progress(simulation_id: str, db: Session = Depends(get_db)):
    progress = db.execute(
        select(UserProgress).where(UserProgress.simulation_id == simulation_id)
    ).scalar_one_or_none()

    if not progress:
        # Initialize progress if it doesn't exist
        progress = UserProgress(simulation_id=simulation_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)

    return progress

@router.post("/update", response_model=ProgressResponse)
async def update_progress(payload: ProgressUpdate, db: Session = Depends(get_db)):
    progress = db.execute(
        select(UserProgress).where(UserProgress.simulation_id == payload.simulation_id)
    ).scalar_one_or_none()

    if not progress:
        progress = UserProgress(simulation_id=payload.simulation_id)
        db.add(progress)

    if payload.resource_id:
        current_resources = list(progress.completed_resource_ids or [])
        if payload.resource_id not in current_resources:
            current_resources.append(payload.resource_id)
            progress.completed_resource_ids = current_resources

    if payload.task_id:
        current_tasks = list(progress.completed_task_ids or [])
        if payload.task_id not in current_tasks:
            current_tasks.append(payload.task_id)
            progress.completed_task_ids = current_tasks

    if payload.skill:
        current_skills = list(progress.verified_skills or [])
        if payload.skill not in current_skills:
            current_skills.append(payload.skill)
            progress.verified_skills = current_skills

    if payload.hours:
        progress.total_learning_hours = (progress.total_learning_hours or 0.0) + payload.hours

    db.commit()
    db.refresh(progress)
    return progress

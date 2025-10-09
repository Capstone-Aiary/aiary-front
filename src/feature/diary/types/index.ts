// 공통 에러 응답 타입
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}

// 페이지네이션 응답을 위한 제네릭 타입
export interface PaginatedResponse<T> {
  items: T[];
  cursor: string | null; // 다음 페이지 조회를 위한 커서
}

// 엔티티: ChatThread
export interface ChatThread {
  id: string; // UUID
  title: string;
  status: 'active' | 'archived';
  createdAt: string; // ISO 8601
}


// 엔티티: Diary
export interface Diary {
  id: string; // UUID
  threadId: string;
  title: string;
  mood: string;
  content: string; // 일기 내용은 생성 후 상세 조회 시 확인 가능
  createdAt: string; // ISO 8601
}

// 요청(Request) 타입들
export interface CreateThreadRequest {
  title: string;
}

export interface UpdateThreadStatusRequest {
  status: 'active' | 'archived';
}

export interface SendMessageRequest {
  threadId: string;
  content: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface CreateDiaryRequest {
  threadId: string;
  title: string;
  mood: string;
}
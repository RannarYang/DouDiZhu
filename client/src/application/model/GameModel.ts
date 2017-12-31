class GameModel {
	// 用户的数据
	public userDto : UserDto;
	public get id(): number {
		return this.userDto.id;
	}
	// 匹配房间的数据
	public _matchRoomDto: MatchRoomDto = new MatchRoomDto();
	public set matchRoomDto(matchRoomDto: MatchRoomDto) {
		this._matchRoomDto.setData(matchRoomDto);
	}
	public get matchRoomDto(): MatchRoomDto {
		return this._matchRoomDto;
	}
}
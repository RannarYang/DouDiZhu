/**
 * 状态模式接口
 */
interface IScene {
	getStateName();
    // state begin
    stateBegin();
    // state end
    stateEnd();
    // state update
    stateUpdate();
}
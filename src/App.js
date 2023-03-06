import Modal from "./PromisifyModal";
import A from "./components/A";
import B from "./components/B";
import C from "./components/C";

export default function App() {
  const showAntdModal = () => {
    Modal.show(A).then(() => {
      console.log("A render");
      setTimeout(() => {
        Modal.show(B).then(() => {
          console.log("B render");
        });
      }, 3000);
      setTimeout(() => {
        Modal.hide(A).then(() => {
          console.log("A hide");
        });
        Modal.show(C);
      }, 4000);
    });
  };
  return (
    <Modal.Provider>
      <div className="app">
        <h1>promisify modal</h1>
        <div className="demo-buttons">
          <button onClick={showAntdModal}>open Modal</button>
        </div>
      </div>
    </Modal.Provider>
  );
}

# promisify-modal
promisify modal with react

```
import Modal from "./PromisifyModal";
import A from "./components/A"

export default function App() {
  const showAntdModal = () => {
    Modal.show(A).then(() => {
      console.log("A render");
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


```

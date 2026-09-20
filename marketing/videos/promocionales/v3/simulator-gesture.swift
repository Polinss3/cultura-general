import Cocoa
let a=CommandLine.arguments
let x=542+Double(a[1])!*355/1206, y=130+Double(a[2])!*772/2622
let p=CGPoint(x:x,y:y)
CGEvent(mouseEventSource:nil,mouseType:.leftMouseDown,mouseCursorPosition:p,mouseButton:.left)!.post(tap:.cghidEventTap)
if a.count>4 {
 let tx=542+Double(a[3])!*355/1206, ty=130+Double(a[4])!*772/2622
 for i in 1...30 { usleep(15000);let q=CGPoint(x:x+(tx-x)*Double(i)/30,y:y+(ty-y)*Double(i)/30);CGEvent(mouseEventSource:nil,mouseType:.leftMouseDragged,mouseCursorPosition:q,mouseButton:.left)!.post(tap:.cghidEventTap) }
 CGEvent(mouseEventSource:nil,mouseType:.leftMouseUp,mouseCursorPosition:CGPoint(x:tx,y:ty),mouseButton:.left)!.post(tap:.cghidEventTap)
} else {usleep(70000);CGEvent(mouseEventSource:nil,mouseType:.leftMouseUp,mouseCursorPosition:p,mouseButton:.left)!.post(tap:.cghidEventTap)}

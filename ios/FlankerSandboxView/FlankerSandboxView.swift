//
//  FlankerSandboxView.swift
//  MindloggerMobile
//
//  Created by Dzmitry on 16.03.23.
//

import Foundation
import UIKit

@objc(FlankerSandboxView)
class FlankerSandboxView: UIView {
  @objc var message: String? = "Hello Native Custom View" {
      didSet {
          self.setupView()
      }
  }

  @objc var onClick: RCTBubblingEventBlock?
  
  override init(frame: CGRect) {
      super.init(frame: frame)
  }

  required init?(coder aDecoder: NSCoder) {
      super.init(coder: aDecoder)
      setupView()
  }
  
  private func setupView() {
    self.backgroundColor = .red
    self.isUserInteractionEnabled = true
    
    let label = UILabel()
    label.center = self.center
    label.textColor = .white
    label.text = self.message
    label.sizeToFit()
    self.addSubview(label)
    
    label.translatesAutoresizingMaskIntoConstraints = false
    
    NSLayoutConstraint.activate([
      label.widthAnchor.constraint(equalToConstant: 260),
      label.heightAnchor.constraint(equalToConstant: 30),
      label.centerXAnchor.constraint(equalTo: self.centerXAnchor),
      label.centerYAnchor.constraint(equalTo: self.centerYAnchor)
    ])
  }
  
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let onClick = self.onClick else { return }

    let params: [String : Any] = ["message":"hey, you've touched screen."]
    onClick(params)
  }
}
